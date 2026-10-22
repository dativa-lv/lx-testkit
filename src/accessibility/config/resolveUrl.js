export function resolvePageUrl(baseUrl, page) {
  if (page.url) {
    return page.url;
  }

  const trimmedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPath = page.path.startsWith('/') ? page.path : `/${page.path}`;
  return `${trimmedBase}${normalizedPath}`;
}
