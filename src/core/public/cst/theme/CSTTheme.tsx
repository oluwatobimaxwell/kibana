import React, { FC } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { HttpStart } from '../../http';

const getSettings = async (http: HttpStart) => {
  return await http.get('/api/cst_theme_service/settings');
};

const CSTTheme: FC<{ http: HttpStart }> = ({ http }) => {
  const { data } = useQuery(['settings'], () => getSettings(http), {
    onSuccess: (data) => {
        // save data to local storage
        localStorage.setItem('cst-theme-settings', JSON.stringify(data));
        // @ts-ignore
        window.getCstThemeSettings = (name: string | undefined) => {
            const settings = JSON.parse(localStorage.getItem('cst-theme-settings') || '{}');
            return name ? settings[name] : settings;
        };
    },
  });
  const style = data as unknown as any;
  return (
    <style>
      {`
        :root {
            --organisationName: ${style?.organisationName || ""};
            --organisationLogoUrl: ${style?.organisationLogoUrl || ""};
            --primaryColor: ${style?.primaryColor || ""};
            --secondaryColor: ${style?.secondaryColor || ""};
            --lightColor: ${style?.lightColor || ""};
            --darkColor: ${style?.darkColor || ""};
            --buttonTextColor: ${style?.buttonTextColor || ""};
            --organisationLogoCss: url(${style?.organisationLogoUrl || ""});
        }
        .cstName::before {
            content: "${style?.organisationName || ""} ";
        }
        .cstVersion::before {
            content: "(V${style?.versionCode || ""})";
        }

    `}
    </style>
  );
};

const queryClient = new QueryClient();

export default (props: any) => (
    <QueryClientProvider client={queryClient}>
      <CSTTheme {...props} />
    </QueryClientProvider>
);
