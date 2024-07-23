const puppeteer = require('puppeteer');

const getLyrics = async (musicSearch) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://zingmp3.vn/');
    try {
        const closeButtonSelector = 'button.zm-btn.close-btn.button';
        const closeButton = await page.$(closeButtonSelector);
        if (closeButton) {
            await closeButton.click();
        }
        await page.type('.search input', musicSearch);
        await page.keyboard.press('Enter');
        await page.waitForSelector('.container.mar-t-30', { timeout: 10000 });
        await page.waitForSelector('.container.mar-t-30 .columns.is-multiline div:nth-child(1) .list.list-border div:nth-child(1) button.action-play', { timeout: 10000 });
        await page.evaluate(() => {
            const playButton = document.querySelector('.container.mar-t-30 .columns.is-multiline div:nth-child(1) .list.list-border div:nth-child(1) button.action-play');
            if (playButton) {
                playButton.click();
            } else {
                throw new Error('Không tìm thấy nút play.');
            }
        });

        await page.waitForSelector('.player-controls-right.level-right button.zm-btn.zm-tooltip-btn.btn-karaoke.is-hover-circle.button', { timeout: 10000 });
        const karaokeButton = await page.$('.player-controls-right.level-right button.zm-btn.zm-tooltip-btn.btn-karaoke.is-hover-circle.button');
        await page.evaluate((karaokeButton) => {
            const rect = karaokeButton.getBoundingClientRect();
            window.scrollTo({ top: rect.top + window.scrollY - window.innerHeight / 2, behavior: 'smooth' });
        }, karaokeButton);
        const boundingBox = await karaokeButton.boundingBox();
        await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
        await page.mouse.down();
        await page.mouse.up();

        let foundLyricUrl = false;

        page.on('request', async request => {
            const url = request.url();
            if (url.includes('lyric?id=')) {
                foundLyricUrl = true;

                const newPage = await browser.newPage();
                await newPage.goto(url);

                const data = await newPage.evaluate(() => {
                    return document.body.innerText;
                });

                await newPage.close();

                try {
                    const jsonData = JSON.parse(data);
                    if (jsonData && jsonData.data && jsonData.data.sentences) {
                        const formattedData = jsonData.data.sentences.map(sentence => {
                            const words = sentence.words;
                            return {
                                line: {
                                    startTime: words[0].startTime,
                                    endTime: words[words.length - 1].endTime,
                                    data: words.map(word => word.data).join(' ')
                                }
                            };
                        });
                        browser.close()
                        return {
                            status: "success",
                            msg: "Crawl lời bài hát thành công",
                            data: formattedData
                        }
                    } else {
                        browser.close()
                        return {
                            status: "fail",
                            msg: `Dữ liệu không đúng định dạng`,
                            data: null
                        }
                    }
                } catch (error) {
                    browser.close()
                    return {
                        status: "fail",
                        msg: `Lỗi khi phân tích dữ liệu JSON: ${error.message}`,
                        data: null
                    }
                }
            }
        });

        await new Promise(resolve => setTimeout(resolve, 10000));

        if (!foundLyricUrl) {
            throw new Error('Không tìm thấy URL chứa xâu "lyric?id=".');
        }
    } catch (error) {
        browser.close()
        return {
            status: "fail",
            msg: error.message,
            data: null
        }
    }
};

module.exports = { getLyrics }