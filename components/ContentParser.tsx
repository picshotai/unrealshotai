import { parseContent } from "@/lib/content-parser"
import { ServerTableOfContents } from "./ServerTableOfContents"
import { ServerFAQAccordion } from "./ServerFAQAccordion"

interface ContentParserProps {
  content: string
}

export function ContentParser({ content }: ContentParserProps) {
  const { tocEntries, faqs, content: parsedContent } = parseContent(content)

  return (
    <>
      {tocEntries.length > 0 && (
        <ServerTableOfContents entries={tocEntries} />
      )}
      <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: parsedContent }} />
      {faqs.length > 0 && (
          <ServerFAQAccordion faqs={faqs} />
      )}
    </>
  )
}

