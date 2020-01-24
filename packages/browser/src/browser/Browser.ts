import {
  FindElementOptions,
  FindPageOptions,
  Selector,
  ScrollValue,
  TypeOptions
} from "@qawolf/types";
import {
  Browser as PlaywrightBrowser,
  DirectNavigationOptions,
  ElementHandle
} from "playwright";
import { ClickOptions } from "../actions/clickElement";
import { Page } from "../page/Page";
import { QAWolfBrowser } from "./QAWolfBrowser";

// PlaywrightBrowser decorated with our helpers
export interface Browser extends PlaywrightBrowser {
  click(
    selector: Selector,
    options?: FindElementOptions & ClickOptions
  ): Promise<ElementHandle>;

  find: (
    selector: Selector,
    options?: FindElementOptions
  ) => Promise<ElementHandle>;

  findProperty: (
    selector: Selector,
    property: string,
    options?: FindElementOptions
  ) => Promise<ElementHandle>;

  goto(
    url: string,
    options?: FindPageOptions & DirectNavigationOptions
  ): Promise<Page>;

  hasText(text: string, options?: FindPageOptions): Promise<boolean>;

  page: (options?: FindPageOptions) => Promise<Page>;

  scroll(
    selector: Selector,
    value: ScrollValue,
    options?: FindElementOptions
  ): Promise<ElementHandle>;

  select(
    selector: Selector,
    value: string | null,
    options?: FindElementOptions
  ): Promise<ElementHandle>;

  type(
    selector: Selector,
    value: string | null,
    options?: FindElementOptions & TypeOptions
  ): Promise<ElementHandle>;

  // reference to our QAWolfBrowser for internal use
  qawolf: QAWolfBrowser;

  // reference to original PlaywrightBrowser.close method
  _close(): Promise<void>;
}
