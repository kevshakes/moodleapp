// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Injectable } from '@angular/core';
import { CoreContentLinksHandlerBase } from '@core/contentlinks/classes/base-handler';
import { CoreContentLinksAction } from '@core/contentlinks/providers/delegate';
import { CoreContentLinksHelperProvider } from '@core/contentlinks/providers/helper';
import { CoreTagProvider } from './tag';

/**
 * Handler to treat links to tag index.
 */
@Injectable()
export class CoreTagIndexLinkHandler extends CoreContentLinksHandlerBase {
    name = 'CoreTagIndexLinkHandler';
    pattern = /\/tag\/index\.php/;

    constructor(private tagProvider: CoreTagProvider, private linkHelper: CoreContentLinksHelperProvider) {
        super();
    }

    /**
     * Get the list of actions for a link (url).
     *
     * @param siteIds List of sites the URL belongs to.
     * @param url The URL to treat.
     * @param params The params of the URL. E.g. 'mysite.com?id=1' -> {id: 1}
     * @param courseId Course ID related to the URL. Optional but recommended.
     * @param data Extra data to handle the URL.
     * @return List of (or promise resolved with list of) actions.
     */
    getActions(siteIds: string[], url: string, params: any, courseId?: number, data?: any):
            CoreContentLinksAction[] | Promise<CoreContentLinksAction[]> {
        return [{
            action: (siteId, navCtrl?): void => {
                const pageParams = {
                    tagId: parseInt(params.id, 10) || 0,
                    tagName: params.tag || '',
                    collectionId: parseInt(params.tc, 10) || 0,
                    areaId: parseInt(params.ta, 10) || 0,
                    fromContextId: parseInt(params.from, 10) || 0,
                    contextId: parseInt(params.ctx, 10) || 0,
                    recursive: parseInt(params.rec, 10) || 1
                };

                if (!pageParams.tagId && (!pageParams.tagName || !pageParams.collectionId)) {
                    this.linkHelper.goInSite(navCtrl, 'CoreTagSearchPage', {}, siteId);
                } else if (pageParams.areaId) {
                    this.linkHelper.goInSite(navCtrl, 'CoreTagIndexAreaPage', pageParams, siteId);
                } else {
                    this.linkHelper.goInSite(navCtrl, 'CoreTagIndexPage', pageParams, siteId);
                }
            }
        }];
    }

    /**
     * Check if the handler is enabled for a certain site (site + user) and a URL.
     * If not defined, defaults to true.
     *
     * @param siteId The site ID.
     * @param url The URL to treat.
     * @param params The params of the URL. E.g. 'mysite.com?id=1' -> {id: 1}
     * @param courseId Course ID related to the URL. Optional but recommended.
     * @return Whether the handler is enabled for the URL and site.
     */
    isEnabled(siteId: string, url: string, params: any, courseId?: number): boolean | Promise<boolean> {
        return this.tagProvider.areTagsAvailable(siteId);
    }
}
