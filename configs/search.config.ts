/**
 * The typesense client caches identical searches in memory, per server instance. It cannot be cleared when the index
 * changes, so this is kept short: an index update shows within a minute.
 */
export const cacheSearchResultsForSeconds = 60;
