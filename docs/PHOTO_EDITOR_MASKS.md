# Photo Editor Masks – Gemini-Compatible Implementation

TL;DR:
- We visually highlight (colored overlay) the regions to edit and instruct Gemini via the prompt to modify only the overlaid areas.
- We send only a single image (`imageData`) and a prompt to the backend.
- Do not ever try to use a separate “mask image” with Gemini in this project.

## Why we do it this way
- Gemini does not officially support inpainting with an explicit binary mask input.
- Relying on Gemini to interpret a separate binary mask is unreliable and leads to inconsistent or broken behavior.
- The practical workaround is to visibly indicate the regions to edit with a colored overlay baked into the image that we send, and use clear prompt instructions.

## How the mask feature currently works
1. Users draw mask strokes using the Mask tool. These strokes represent areas to edit.
2. Before sending to the API, we:
   - Render the original image at its original dimensions on a temporary canvas.
   - Draw a colored, semi-transparent overlay on top of the masked regions (the visual highlight).
   - Export the composited result as a PNG data URL (`imageData`).
3. We send the `imageData` and the text `prompt` to the backend (`/api/photo-editor/generate`).
4. The backend forwards the prompt and image to Gemini and returns the first generated image response.
5. The frontend replaces the current image with the newly generated image.

## Developer contract (do this, and only this)
- Request contract:
  - Send `imageData` (PNG data URL of the composited image with the mask overlay baked in).
  - Send `prompt` (text instruction that explicitly says to edit only the overlaid areas).
  - Do not send `maskImage`, `maskData`, or any separate mask content.
- Backend contract:
  - Accept only `imageData` and `prompt`.
  - Forward them to Gemini and return the generated image if present.

## Clear instruction for the prompt
- Always include explicit guidance like:
  - “Modify only the regions highlighted by the colored overlay. Keep all non-overlaid areas unchanged.”
- This makes the mask intent unambiguous for Gemini.

## Do NOT do these (important)
- Do NOT attempt to send a separate binary mask image to Gemini.
- Do NOT add `maskImage` or `maskData` fields to the request type or API route for Gemini usage.
- Do NOT modify the backend to include a mask image in the Gemini content.
- Do NOT rely on Gemini to interpret a separate mask image for inpainting; it’s not supported and leads to breakage.

## If things get messed up — quick fix checklist
- Mask edits ignored? Ensure:
  - The overlay is actually drawn onto the temp canvas before exporting `imageData`.
  - Mask strokes are transformed from display canvas coordinates to original image coordinates before drawing the overlay.
  - The prompt includes a clear instruction to edit only the overlaid areas.
- Someone added `maskImage` or `maskData`?
  - Remove those fields from:
    - Types (GenerationRequest)
    - Client serialization
    - API route handling
  - Return to the single `imageData` + `prompt` contract.

## File pointers (for maintenance)
- Frontend:
  - components/photo-editor/AnnotationEditor.tsx
  - components/photo-editor/AnnotationCanvas.tsx
  - hooks/useCanvas.ts
  - hooks/useannotations.ts
  - utils/photo-editor/coordinate-transform.ts
  - types/photo-editor.ts
- Client / API:
  - lib/photo-editor/client.ts
  - lib/photo-editor/types.ts
  - app/api/photo-editor/generate/route.ts

## Notes
- The overlay-baked approach keeps the contract simple and robust for Gemini.
- The prompt is critical: it tells Gemini exactly which regions to modify (the overlaid areas).
- Keep the overlay color and opacity consistent so the visual signal is strong and predictable.

## Relevant code snippets (current implementation)

### 1) GenerationRequest – no mask fields
```ts:%2FUsers%2Fkishanchaudhary%2FMusic%2Fdodostarter%2Flib%2Fphoto-editor%2Ftypes.ts
export interface GenerationRequest {
  imageData: string; // base64 encoded image
  prompt?: string;
  strength?: number; // 0-1, how much to change the image
  guidance?: number; // 1-20, how closely to follow the prompt
  steps?: number; // number of inference steps
  seed?: number; // for reproducible results
}
```

### 2) Client serialization – sends only imageData and prompt
```ts:%2FUsers%2Fkishanchaudhary%2FMusic%2Fdodostarter%2Flib%2Fphoto-editor%2Fclient.ts
export class APIClient {
    // ... existing code ...
    async generateImage(request: GenerationRequest): Promise<GenerationResponse> {
        try {
            const response = await fetch('/api/photo-editor/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageData: request.imageData,
                    prompt: request.prompt,
                    strength: request.strength || 0.8,
                    guidance: request.guidance || 7,
                    steps: request.steps || 20,
                    // Removed maskImage/maskData; overlay is baked into imageData
                    model: (request as any).model,
                }),
            });
            // ... existing code ...
        } catch (error: any) {
            // ... existing code ...
        }
    }
    // ... existing code ...
}
```

### 3) Backend route – accepts imageData and prompt only
```ts:%2FUsers%2Fkishanchaudhary%2FMusic%2Fdodostarter%2Fapp%2Fapi%2Fphoto-editor%2Fgenerate%2Froute.ts
export async function POST(request: NextRequest) {
  try {
    // ... existing code ...
    const body = await request.json();
    const { imageData, prompt, strength = 0.8, guidance = 7, steps = 20, model } = body;

    if (!imageData) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 });
    }

    // Strip data URL header if present
    const base64Image = imageData.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    // Prepare content for Gemini
    const contents: any[] = [];
    if (prompt) {
      contents.push({ text: prompt });
    } else {
      contents.push({ text: "Enhance and improve this image while maintaining its original content and style." });
    }

    // Provide the composited image (with overlay if present)
    contents.push({
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    });

    const modelName = model || "gemini-2.5-flash-image";

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        responseModalities: [Modality.IMAGE],
        candidateCount: 1,
      },
    });
    // ... existing code ...
  } catch (error) {
    // ... existing code ...
  }
}
```

### 4) Coordinate transform – convert mask strokes to original image coordinates
```ts:%2FUsers%2Fkishanchaudhary%2FMusic%2Fdodostarter%2Futils%2Fphoto-editor%2Fcoordinate-transform.ts
export const transformMaskStrokesToImageCoordinates = (
  maskStrokes: MaskStroke[],
  displayDimensions: { width: number; height: number },
  originalDimensions: { width: number; height: number }
): MaskStroke[] => {
  const scaleX = originalDimensions.width / displayDimensions.width;
  const scaleY = originalDimensions.height / displayDimensions.height;

  return maskStrokes.map(stroke => ({
    ...stroke,
    path: stroke.path.map(point => ({
      x: point.x * scaleX,
      y: point.y * scaleY,
      timestamp: point.timestamp,
    })),
  }));
};
```

### 5) Annotation editor – prepare imageData, prompt, and call the client
Note: The client ignores any `maskData` field. To ensure masked edits affect the result, draw the colored overlay onto the temp canvas before calling `toDataURL`.

```tsx:%2FUsers%2Fkishanchaudhary%2FMusic%2Fdodostarter%2Fcomponents%2Fphoto-editor%2FAnnotationEditor.tsx
// inside handleGenerate(prompt: string)
try {
  setIsGenerating(true);

  // Create a temporary canvas matching the original image dimensions
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = originalImageDimensions.width;
  tempCanvas.height = originalImageDimensions.height;
  const ctx = tempCanvas.getContext("2d");
  if (!ctx || !image) throw new Error("Canvas context unavailable or no image");

  // Draw image at original size for API
  ctx.drawImage(image, 0, 0, originalImageDimensions.width, originalImageDimensions.height);

  // IMPORTANT: draw your colored overlay for masked regions here (composite onto ctx)
  // e.g., iterate transformedMaskStrokes and draw semi-transparent fills over those paths

  const imageData = canvasToDataURL(tempCanvas);

  // Transform mask strokes from display coordinates to original image coordinates (for overlay drawing)
  const transformedMaskStrokes = maskStrokes.length > 0 
    ? transformMaskStrokesToImageCoordinates(
        maskStrokes, 
        dimensions, 
        originalImageDimensions
      )
    : undefined;

  const request = {
    imageData,
    // Note: maskData is ignored by the client. Overlay must be baked into imageData.
    maskData: transformedMaskStrokes,
    prompt,
    strength: 0.8,
    guidance: 7.5,
    steps: 20,
  };

  const response = await apiClient.generateImage(request);
  if (response.success && response.result) {
    onImageGenerated?.(response.result.output);
    // ... existing code ...
  } else {
    // ... existing code ...
  }
} catch (error) {
  // ... existing code ...
} finally {
  setIsGenerating(false);
}
```

## Final warning (do not change this)
- With Gemini, do not ever try to modify the logic to use a separate “mask image for edits.” It’s not supported. Use the colored overlay baked into `imageData` and explicit prompt instructions.