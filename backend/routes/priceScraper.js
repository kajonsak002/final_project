const puppeteer = require("puppeteer");

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function scrapePrices() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // ปลอมตัวว่าไม่ใช่ headless bot
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  await page.goto("https://mex.moc.go.th/page/dit/checkprice/type/R/catid/1", {
    waitUntil: "networkidle2",
    timeout: 15000,
  });

  await page.waitForSelector("table.dataTable", { timeout: 15000 });

  const dateGetData = await page.evaluate(() => {
    const caption = document.querySelector("table caption");
    return caption ? caption.innerText.trim() : "ไม่พบวันที่";
  });

  let allData = [];

  while (true) {
    const pageData = await page.evaluate(() => {
      const rows = [];
      const table = document.querySelector("table.dataTable");
      if (!table) return null;

      table.querySelectorAll("tbody tr").forEach((tr) => {
        const tds = tr.querySelectorAll("td");
        if (tds.length >= 5) {
          rows.push({
            name: tds[1].innerText.trim(),
            price: tds[2].innerText.trim(),
            avgPrice: tds[3].innerText.trim(),
            unit: tds[4].innerText.trim(),
          });
        }
      });
      return rows;
    });

    if (!pageData) break;
    allData = allData.concat(pageData);

    const isNextDisabled = await page.evaluate(() => {
      const nextBtn = document.querySelector("a.paginate_button.next");
      return !nextBtn || nextBtn.classList.contains("disabled");
    });

    if (isNextDisabled) break;

    await page.click("a.paginate_button.next");
    await delay(500);
  }

  await browser.close();
  return { title: dateGetData, allData };
}

module.exports = scrapePrices;
