const puppeteer = require('puppeteer');

function formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(2);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(5, '0')}`;
}

const getLyrics = async (musicSearch) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://zingmp3.vn/');

    let resultData = null;

    try {
        const closeButtonSelector = 'button.zm-btn.close-btn.button';
        const closeButton = await page.$(closeButtonSelector);
        if (closeButton) {
            await closeButton.click();
        }
        await page.type('.search input', musicSearch);
        await page.keyboard.press('Enter');
        await page.waitForSelector('.container.mar-t-30', { timeout: 10000 });

        try {
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
            const requestHandler = new Promise((resolve, reject) => {
                page.on('request', async request => {
                    const url = request.url();
                    if (url.includes('lyric?id=')) {
                        const newPage = await browser.newPage();
                        await newPage.goto(url);

                        const data = await newPage.evaluate(() => document.body.innerText);
                        await newPage.close();

                        try {
                            const jsonData = JSON.parse(data);
                            if (jsonData && jsonData.data && jsonData.data.sentences) {
                                // Chuyển đổi dữ liệu
                                const formattedData = jsonData.data.sentences.map(sentence => {
                                    const startTime = sentence.words[0].startTime;
                                    const lineData = sentence.words.map(word => word.data).join(' ');
                                    return `[${formatTime(startTime)}] ${lineData}`;
                                }).join('\n');

                                resolve({
                                    status: "success",
                                    msg: "Crawl lời bài hát thành công",
                                    data: formattedData
                                });
                            } else {
                                resolve({
                                    status: "error",
                                    msg: `Dữ liệu không đúng định dạng`,
                                    data: null
                                });
                            }
                        } catch (error) {
                            resolve({
                                status: "error",
                                msg: `Lỗi khi phân tích dữ liệu JSON: ${error.message}`,
                                data: null
                            });
                        }
                    }
                });
            });

            const timeoutPromise = new Promise((_, reject) => setTimeout(() => {
                reject(new Error('Không tìm thấy URL, vui lòng thử lại'));
            }, 10000));

            try {
                resultData = await Promise.race([requestHandler, timeoutPromise]);
            } catch (error) {
                resultData = {
                    status: "error",
                    msg: `Lỗi: ${error.message}`,
                    data: null
                };
            }

            return resultData;
        } catch (error) {
            return{
                status: "error",
                msg: "Không tìm thấy bài hát hoặc nút play.",
                data: null
            };
        }
    } catch (error) {
        return{
            status: "error",
            msg: "Lỗi hệ thống",
            data: null
        };
    } finally {
        await browser.close();
    }
};

module.exports = { getLyrics }