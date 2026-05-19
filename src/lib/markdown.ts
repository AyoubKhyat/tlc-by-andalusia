export function renderMarkdown(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-navy dark:text-white mb-2 mt-6">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-navy dark:text-white mb-3 mt-6">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-navy dark:text-white mb-3 mt-6">$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="rounded-xl max-w-full my-4" />'
  );
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-burgundy underline hover:text-burgundy-light transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  html = html.replace(
    /^&gt; (.+)$/gm,
    '<blockquote class="border-l-4 border-burgundy/30 pl-4 italic text-gray-500 dark:text-gray-400 my-4">$1</blockquote>'
  );
  html = html.replace(/^---$/gm, '<hr class="my-6 border-gray-200 dark:border-slate-700" />');
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-700 dark:text-gray-300 mb-1">$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-gray-700 dark:text-gray-300 mb-1">$1</li>');

  const blocks = html.split(/\n\n+/);
  html = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<hr") ||
        trimmed.startsWith("<li") ||
        trimmed.startsWith("<img")
      ) {
        return trimmed;
      }
      return `<p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return html;
}
