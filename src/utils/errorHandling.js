const DEFAULT_FALLBACK_MESSAGE = 'Something went wrong. Please try again later.';

const ERROR_MESSAGES = {
  SERVER_ERROR: 'Something went wrong on our side. Please try again in a moment.',
  RATE_LIMITED: 'You’re doing that too fast. Please wait a moment.',
  RELAY_LOCKED: 'Someone else is continuing this relay. Try again shortly.',
};

export const getFriendlyError = (error) => {
  const data = error?.response?.data || {};
  const code = data.error_code;
  if (code && ERROR_MESSAGES[code]) {
    return { message: ERROR_MESSAGES[code], code };
  }
  const rawMessage = data.error || data.message;
  if (typeof rawMessage === 'string' && rawMessage.trim()) {
    return { message: rawMessage, code };
  }
  return { message: DEFAULT_FALLBACK_MESSAGE, code };
};

export const buildReportIssueLink = (error, userId) => {
  const data = error?.response?.data || {};
  const rawMessage = data.error || data.message || 'Unknown error';
  const code = data.error_code || 'UNKNOWN';
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const bodyLines = [
    `Error: ${rawMessage}`,
    `Code: ${code}`,
    `URL: ${url}`,
    `User: ${userId || 'unknown'}`,
  ];
  const body = encodeURIComponent(bodyLines.join('\n'));
  const subject = encodeURIComponent('Issue Report');
  return `mailto:meow@meowverse.ai?subject=${subject}&body=${body}`;
};
