import fetch from 'isomorphic-fetch';
import { NextPageContext } from 'next';
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { H3, P, darkColors, colors, A } from '../common/styleguide';
import ContentContainer from '../components/ContentContainer';
import ExploreNav from '../components/Explore/ExploreNav';
import {
  PlatformAndroid,
  PlatformIOS,
  PlatformMacOS,
  PlatformWeb,
  PlatformWindows,
  PlatformExpo,
  ReactLogo,
} from '../components/Icons';
import Library from '../components/Library';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Library as LibraryType, Query } from '../types';
import getApiUrl from '../util/getApiUrl';
import urlWithQuery from '../util/urlWithQuery';

const UPDATED_IN = 1000 * 60 * 60 * 24 * 90; // 90 days
const DEFAULT_PARAMS: Query = {
  wasRecentlyUpdated: 'true',
  isMaintained: 'true',
  order: 'popularity',
};

const renderLibs = (list, count = 4) => {
  return (
    <View style={styles.librariesContainer}>
      {list
        .filter(
          lib => new Date().getTime() - new Date(lib.github.stats.updatedAt).getTime() < UPDATED_IN
        )
        .splice(0, count)
        .map((item: any, index: number) => (
          <Library
            key={`explore-item-${index}-${item.github.name}`}
            library={item}
            showPopularity
            skipMeta
          />
        ))}
    </View>
  );
};

type ExploreSectionProps = {
  data: LibraryType[];
  title: string;
  filter: (LibraryType) => boolean;
  icon: any;
  count?: number;
  queryParams?: Query;
};

const ExploreSection = ({
  data,
  title,
  filter,
  icon,
  count = 4,
  queryParams = { [title.toLowerCase()]: true },
}: ExploreSectionProps) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const color = isDark ? darkColors.pewter : colors.gray5;
  const hoverColor = isDark ? colors.gray5 : colors.gray4;
  const hashLink = title.replace(/\s/g, '').toLowerCase();

  return (
    <>
      <H3 style={styles.subHeader} nativeID={hashLink}>
        <View style={styles.subHeaderIcon}>
          {React.createElement(icon, { fill: color, width: 28, height: 30 })}
        </View>
        <A
          href={`#${hashLink}`}
          target="_self"
          style={[styles.subHeaderTitle, { color }]}
          hoverStyle={{ color: hoverColor }}>
          {title}
        </A>
      </H3>
      <View style={styles.librariesContainer}>{renderLibs(data.filter(filter), count)}</View>
      <P style={[styles.note, { color: isDark ? darkColors.secondary : colors.gray5 }]}>
        Want to see more? Check out other{' '}
        <A href={urlWithQuery('/', { ...queryParams, ...DEFAULT_PARAMS })} target="_self">
          {title} libraries
        </A>{' '}
        in the directory!
      </P>
    </>
  );
};

const Explore = ({ data }) => {
  return (
    <>
      <ExploreNav
        title="Explore"
        description="See which libraries are popular among the community in last days."
      />
      <ContentContainer style={styles.container}>
        <ExploreSection
          title="Core platforms"
          icon={ReactLogo}
          data={data}
          filter={lib => lib.android === true && lib.ios === true}
          count={8}
          queryParams={{ android: 'true', ios: 'true' }}
        />
        <ExploreSection
          title="Android"
          icon={PlatformAndroid}
          data={data}
          filter={lib => lib.android === true && !lib.ios}
        />
        <ExploreSection
          title="iOS"
          icon={PlatformIOS}
          data={data}
          filter={lib => lib.ios === true && !lib.android}
        />
        <ExploreSection
          title="Expo"
          icon={PlatformExpo}
          data={data}
          filter={lib => lib.expo === true}
        />
        <ExploreSection
          title="macOS"
          icon={PlatformMacOS}
          data={data}
          filter={lib => lib.macos === true}
        />
        <ExploreSection
          title="Web"
          icon={PlatformWeb}
          data={data}
          filter={lib => lib.web === true}
        />
        <ExploreSection
          title="Windows"
          icon={PlatformWindows}
          data={data}
          filter={lib => lib.windows === true}
        />
      </ContentContainer>
    </>
  );
};

Explore.getInitialProps = async (ctx: NextPageContext) => {
  let url = getApiUrl(urlWithQuery('/libraries', { limit: 9999, order: 'popularity' }), ctx);
  let response = await fetch(url);
  let result = await response.json();

  return {
    data: result.libraries,
    query: ctx.query,
  };
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  librariesContainer: {
    paddingVertical: 4,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
  subHeaderIcon: {
    marginTop: 4,
    marginRight: 12,
    float: 'left',
  },
  subHeaderTitle: {
    marginTop: 16,
    fontWeight: '700',
    textDecorationLine: 'none',
    backgroundColor: 'transparent',
  },
  note: {
    textAlign: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
    fontSize: 14,
  },
});

export default Explore;
