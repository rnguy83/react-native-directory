import * as React from 'react';
import Head from 'next/head';
import { View } from 'react-native';
import { AppearanceProvider } from 'react-native-appearance';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomAppearanceProvider from '../context/CustomAppearanceProvider';
import Favicon from '../components/Favicon';
import GlobalHeader from '../components/GlobalHeader';
import GlobalOrderControl from '../components/GlobalOrderControl';
import GlobalPlatformControl from '../components/GlobalPlatformControl';
import GlobalSearch from '../components/GlobalSearch';
import GlobalFooter from '../components/GlobalFooter';
import data from '../assets/data.json';

const site = {
  title: 'React Native Directory',
  description: 'A directory to find packages for your React Native apps',
};

const themeColor = '#fff';

export default function App(props: any) {
  let { pageProps, Component, router } = props;

  return (
    <>
      <Head>
        <title>React Native Directory</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @font-face {
              font-family: 'office-code';
              src: url(${require('../assets/fonts/OfficeCodePro-Regular.eot')});
              src: url(${require('../assets/fonts/OfficeCodePro-Regular.ttf')}) format('truetype');
            }

            @font-face {
              font-family: 'office-code-medium';
              src: url(${require('../assets/fonts/OfficeCodePro-Medium.eot')});
              src: url(${require('../assets/fonts/OfficeCodePro-Medium.ttf')}) format('truetype');
            }
          `,
          }}
        />

        {injectMeta.map((value, index) => {
          return <meta key={`meta-${index}`} {...value} />;
        })}
      </Head>
      <SafeAreaProvider>
        <AppearanceProvider>
          <CustomAppearanceProvider>
            <>
              <Favicon />
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  maxWidth: 1300,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}>
                <GlobalHeader count={data.libraries.length} />
                <GlobalSearch query={router.query} />
                <GlobalPlatformControl query={router.query} />
                <GlobalOrderControl query={router.query} />
                <Component {...pageProps} />
                <GlobalFooter />
              </View>
            </>
          </CustomAppearanceProvider>
        </AppearanceProvider>
      </SafeAreaProvider>
    </>
  );
}

const injectMeta = [
  {
    name: `description`,
    content: site.description,
  },
  {
    property: `og:description`,
    content: site.description,
  },
  {
    property: `og:title`,
    content: site.title,
  },
  {
    property: 'og:site_name',
    content: site.title,
  },
  {
    property: 'og:url',
    content: `https://reactnative.directory`,
  },
  {
    property: `og:type`,
    content: `website`,
  },
  {
    key: 'viewport',
    name: 'viewport',
    content:
      'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover',
  },
  {
    name: 'msapplication-TileColor',
    content: themeColor,
  },
  {
    name: 'theme-color',
    content: themeColor,
  },
  { name: `twitter:card`, content: 'Find packages for your apps' },
  { name: `twitter:title`, content: site.title },
  { name: `twitter:description`, content: site.description },

  // Image
  // { property: 'og:image', content: image.url },
  // { property: 'og:image:secure_url', content: image.secureUrl },
  // { property: 'og:image:type', content: image.type },
  // { property: 'og:image:width', content: image.width },
  // { property: 'og:image:height', content: image.height },
  // { property: 'og:image:alt', content: image.description },
];
