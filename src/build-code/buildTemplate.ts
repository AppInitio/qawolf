import { devices } from 'playwright';
import { UrlWithStringQuery } from 'url';

interface BuildTemplateOptions {
  device?: string;
  name: string;
  url: UrlWithStringQuery;
}

const REQUIRE_QAWOLF = 'const qawolf = require("qawolf");';

const buildRequires = (device?: string): string => {
  if (!device) return REQUIRE_QAWOLF;

  if (!devices[device]) {
    throw new Error(`Device ${device} not available in Playwright`);
  }

  const requires = `const { devices } = require("playwright");
  ${REQUIRE_QAWOLF}
  
  const device = devices["${device}"];
  `;

  return requires;
};

const buildNewContext = (device?: string): string => {
  if (!device) return 'const context = await browser.newContext();';

  const context = `const context = await browser.newContext({
      userAgent: device.userAgent,
      viewport: device.viewport
    });`;

  return context;
};

export const buildScriptTemplate = ({
  device,
  name,
  url,
}: BuildTemplateOptions): string => {
  const code = `${buildRequires(device)}

const ${name} = async context => {
  let page = await context.newPage();
  await page.goto("${url}");
  await qawolf.create();
};

exports.${name} = ${name};

if (require.main === module) {
  (async () => {
    const browser = await qawolf.launch();
    ${buildNewContext(device)}
    await ${name}(context);
    await browser.close();
  })();
}`;

  return code;
};

export const buildTestTemplate = ({
  device,
  name,
  url,
}: BuildTemplateOptions): string => {
  const code = `${buildRequires(device)}

  let browser;
  let page;

  beforeAll(async () => {
    browser = await qawolf.launch();
    ${buildNewContext(device)}
    page = await context.newPage();
  });

  afterAll(() => browser.close());

  test('${name}', async () => {
    await page.goto("${url}");
    await qawolf.create();
  });`;

  return code;
};
