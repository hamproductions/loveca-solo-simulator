import { Partytown } from '@builder.io/partytown/react';
import { Metadata } from '~/components/layout/Metadata';

export function Head() {
  return (
    <>
      <Metadata />

      <script
        type="text/partytown"
        src="https://www.googletagmanager.com/gtag/js?id=G-SRE7F723Z5"
      ></script>

      <script
        type="text/partytown"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag() {
              dataLayer.push(arguments);
          }
          gtag("js", new Date());
          gtag("config", "G-SRE7F723Z5");
          `
        }}
      />

      <Partytown lib={(import.meta.env.PUBLIC_ENV__BASE_URL ?? '') + '/~partytown/'} />
    </>
  );
}
