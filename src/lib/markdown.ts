import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: true });

export function renderMarkdown(body: string): string {
  if (!body.trim()) return '';
  return marked.parse(body) as string;
}
