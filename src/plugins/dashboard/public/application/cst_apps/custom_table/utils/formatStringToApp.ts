export const formatStringToTableApp = (
  str: string
): {
  valid: boolean;
  message?: string;
  table?: {
    app: string;
    fields: string[];
    filters?: any[];
  };
} => {
  try {
    const data = JSON.parse(
      str
        .replace(/'/g, '"')
        .replace(/\"/g, '"')
        .replace(/(\r\n|\n|\r)/gm, '')
    );
    if (data.hasOwnProperty('app') && data.hasOwnProperty('fields')) {
      return {
        valid: true,
        table: data,
      };
    }
    return {
      valid: false,
      message: 'Invalid JSON',
    };
  } catch (error) {
    return {
      valid: false,
      message: str,
    };
  }
};

export const getAppName = (markdown: string): string => {
  const toAppName = formatStringToTableApp(markdown);
  if (toAppName?.valid) {
    return toAppName?.table?.app || '';
  }
  return markdown?.replace(/[\[\]]/g, '');
};

export const getFields = (
  markdown: string
): {
  name: string;
  type: string;
  required: boolean;
}[] => {
  const toAppName = formatStringToTableApp(markdown);
  if (toAppName?.valid) {
    return (toAppName?.table?.fields || []).map((field) => {
      if (typeof field === 'string') {
        return {
          name: field,
          type: 'string',
          required: true,
        };
      }
      return field;
    });
  }
  return [];
};

export const getTableFilters = (markdown: string): any[] => {
  const toAppName = formatStringToTableApp(markdown);
  if (toAppName?.valid) {
    return (toAppName?.table?.filters || []).map((filter) => ({
      term: {
        [filter.field]: filter.value,
      },
    }));
  }
  return [];
};
