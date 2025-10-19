import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/bytedance/seedream/v4/edit", {
  input: {
    prompt: "Dress the model in the clothes and hat. Add a cat to the scene and change the background to a Victorian era building.",
    image_size: {
      height: 2160,
      width: 3840
    },
    num_images: 1,
    max_images: 1,
    enable_safety_checker: true,
    image_urls: ["https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_1.png", "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_2.png", "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_3.png", "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_4.png"]
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});
console.log(result.data);
console.log(result.requestId);





# Bytedance Seedream v4 Edit

> A new-generation image creation model ByteDance, Seedream 4.0 integrates image generation and image editing capabilities into a single, unified architecture.


## Overview

- **Endpoint**: `https://fal.run/fal-ai/bytedance/seedream/v4/edit`
- **Model ID**: `fal-ai/bytedance/seedream/v4/edit`
- **Category**: image-to-image
- **Kind**: inference
**Tags**: stylized, transform, editing



## API Information

This model can be used via our HTTP API or more conveniently via our client libraries.
See the input and output schema below, as well as the usage examples.


### Input Schema

The API accepts the following input parameters:


- **`prompt`** (`string`, _required_):
  The text prompt used to edit the image
  - Examples: "Dress the model in the clothes and hat. Add a cat to the scene and change the background to a Victorian era building."

- **`image_size`** (`ImageSize | Enum`, _optional_):
  The size of the generated image. The minimum total image area is 921600 pixels. Failing this, the image size will be adjusted to by scaling it up, while maintaining the aspect ratio.
  - Default: `{"height":2048,"width":2048}`
  - One of: ImageSize | Enum
  - Examples: {"height":2160,"width":3840}

- **`num_images`** (`integer`, _optional_):
  Number of separate model generations to be run with the prompt. Default value: `1`
  - Default: `1`
  - Range: `1` to `6`

- **`max_images`** (`integer`, _optional_):
  If set to a number greater than one, enables multi-image generation. The model will potentially return up to `max_images` images every generation, and in total, `num_images` generations will be carried out. In total, the number of images generated will be between `num_images` and `max_images*num_images`. The total number of images (image inputs + image outputs) must not exceed 15 Default value: `1`
  - Default: `1`
  - Range: `1` to `6`

- **`seed`** (`integer`, _optional_):
  Random seed to control the stochasticity of image generation.

- **`sync_mode`** (`boolean`, _optional_):
  If `True`, the media will be returned as a data URI and the output data won't be available in the request history.
  - Default: `false`

- **`enable_safety_checker`** (`boolean`, _optional_):
  If set to true, the safety checker will be enabled. Default value: `true`
  - Default: `true`
  - Examples: true

- **`image_urls`** (`list<string>`, _required_):
  List of URLs of input images for editing. Presently, up to 10 image inputs are allowed. If over 10 images are sent, only the last 10 will be used.
  - Array of string
  - Examples: ["https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_1.png","https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_2.png","https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_3.png","https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_4.png"]



**Required Parameters Example**:

```json
{
  "prompt": "Dress the model in the clothes and hat. Add a cat to the scene and change the background to a Victorian era building.",
  "image_urls": [
    "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_1.png",
    "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_2.png",
    "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_3.png",
    "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_4.png"
  ]
}
```

**Full Example**:

```json
{
  "prompt": "Dress the model in the clothes and hat. Add a cat to the scene and change the background to a Victorian era building.",
  "image_size": {
    "height": 2160,
    "width": 3840
  },
  "num_images": 1,
  "max_images": 1,
  "enable_safety_checker": true,
  "image_urls": [
    "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_1.png",
    "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_2.png",
    "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_3.png",
    "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_4.png"
  ]
}
```


### Output Schema

The API returns the following output format:

- **`images`** (`list<Image>`, _required_):
  Generated images
  - Array of Image
  - Examples: [{"url":"https://storage.googleapis.com/falserverless/example_outputs/seedream4_edit_output.png"}]

- **`seed`** (`integer`, _required_):
  Seed used for generation
  - Examples: 746406749



**Example Response**:

```json
{
  "images": [
    {
      "url": "https://storage.googleapis.com/falserverless/example_outputs/seedream4_edit_output.png"
    }
  ],
  "seed": 746406749
}
```


## Usage Examples

### cURL

```bash
curl --request POST \
  --url https://fal.run/fal-ai/bytedance/seedream/v4/edit \
  --header "Authorization: Key $FAL_KEY" \
  --header "Content-Type: application/json" \
  --data '{
     "prompt": "Dress the model in the clothes and hat. Add a cat to the scene and change the background to a Victorian era building.",
     "image_urls": [
       "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_1.png",
       "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_2.png",
       "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_3.png",
       "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_4.png"
     ]
   }'
```

### Python

Ensure you have the Python client installed:

```bash
pip install fal-client
```

Then use the API client to make requests:

```python
import fal_client

def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
           print(log["message"])

result = fal_client.subscribe(
    "fal-ai/bytedance/seedream/v4/edit",
    arguments={
        "prompt": "Dress the model in the clothes and hat. Add a cat to the scene and change the background to a Victorian era building.",
        "image_urls": ["https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_1.png", "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_2.png", "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_3.png", "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_4.png"]
    },
    with_logs=True,
    on_queue_update=on_queue_update,
)
print(result)
```

### JavaScript

Ensure you have the JavaScript client installed:

```bash
npm install --save @fal-ai/client
```

Then use the API client to make requests:

```javascript
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/bytedance/seedream/v4/edit", {
  input: {
    prompt: "Dress the model in the clothes and hat. Add a cat to the scene and change the background to a Victorian era building.",
    image_urls: ["https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_1.png", "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_2.png", "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_3.png", "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_4.png"]
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});
console.log(result.data);
console.log(result.requestId);
```


## Additional Resources

### Documentation

- [Model Playground](https://fal.ai/models/fal-ai/bytedance/seedream/v4/edit)
- [API Documentation](https://fal.ai/models/fal-ai/bytedance/seedream/v4/edit/api)
- [OpenAPI Schema](https://fal.ai/api/openapi/queue/openapi.json?endpoint_id=fal-ai/bytedance/seedream/v4/edit)

### fal.ai Platform

- [Platform Documentation](https://docs.fal.ai)
- [Python Client](https://docs.fal.ai/clients/python)
- [JavaScript Client](https://docs.fal.ai/clients/javascript)