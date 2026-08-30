// Downloads all WorkBuddy site assets to public/ — run: node scripts/download-assets.mjs
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const CDN = 'https://codebuddy-1328495429.cos.accelerate.myqcloud.com/web/workbuddy/0fadefe472cfb64411edc82a21f5625ea892e899/assets';

const ASSETS = {
  // fonts
  'fonts/AlimamaShuHeiTi-Bold.subset.woff2': `${CDN}/AlimamaShuHeiTi-Bold.subset-B7GgQqeL.woff2`,
  'fonts/AlimamaFangYuanTiVF-Thin.subset.woff2': `${CDN}/AlimamaFangYuanTiVF-Thin.subset-CPWgZJiz.woff2`,
  // brand
  'brand/logo.svg': `${CDN}/logo.svg`,
  'brand/workbuddy-logo.png': `${CDN}/workbuddy-logo-WhgOvEF7.png`,
  'brand/workbuddy-icon.svg': `${CDN}/workbuddy-icon-BujKiC6G.svg`,
  'brand/codebuddy.svg': `${CDN}/codebuddy-CbLgLAFt.svg`,
  // hero
  'hero/home-bg.png': `${CDN}/home-bg-cIjkRW7l.png`,
  // product demo
  'demo/demo-ava.png': `${CDN}/demo-ava-Dea2Yurs.png`,
  'demo/work-face.svg': `${CDN}/work-face-Dv2kfybc.svg`,
  'demo/markdown.svg': `${CDN}/markdown-CF4hnLni.svg`,
  'demo/word.svg': `${CDN}/word-BVefIDsB.svg`,
  'demo/ppt.svg': `${CDN}/ppt-mZZtqian.svg`,
  'demo/junheng.svg': `${CDN}/junheng-BRide2NU.svg`,
  // capabilities
  'cap/scenario1-feature1.png': `${CDN}/scenario1-feature1-BPMObM4f.png`,
  'cap/scenario1-feature2.png': `${CDN}/scenario1-feature2-HFwGeUzb.png`,
  'cap/mac.png': `${CDN}/mac-BqzMmYsu.png`,
  'cap/scene1.mp4': `${CDN}/scene1-DiX-ru14.mp4`,
  'cap/scene1-poster.webp': `${CDN}/scene1-poster-CvKY8O-u.webp`,
  'cap/scene2.mp4': `${CDN}/scene2-C37WCerk.mp4`,
  'cap/scene2-poster.webp': `${CDN}/scene2-poster-CAhH4oGP.webp`,
  'cap/scene3-poster.webp': `${CDN}/scene3-poster-COx3UjFN.webp`,
  'cap/scene4-poster.webp': `${CDN}/scene4-poster-DN-OFEG7.webp`,
  // ecosystem icons
  'eco/jira.svg': `${CDN}/jira-CizsjVHA.svg`,
  'eco/google-drive.svg': `${CDN}/google-drive-DJ-U27PD.svg`,
  'eco/github.svg': `${CDN}/github-LtdLlGFw.svg`,
  'eco/linear.svg': `${CDN}/linear-BgeV-xBM.svg`,
  'eco/office.svg': `${CDN}/office-D-rOKf_j.svg`,
  'eco/notion.svg': `${CDN}/notion-lD-rUZt8.svg`,
  'eco/slack.svg': `${CDN}/slack-CU8ArKDu.svg`,
  // cta
  'cta/join.mp4': `${CDN}/join-C4iV7JlU.mp4`,
};

// scene3/scene4 videos are lazy-loaded; try conventional names, skip on 404
const MAYBE = {
  'cap/scene3.mp4': `${CDN}/scene3.mp4`,
};

async function download(rel, url) {
  const dest = join(ROOT, rel);
  await mkdir(dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return rel;
}

const entries = Object.entries(ASSETS);
let done = 0, failed = [];
for (let i = 0; i < entries.length; i += 4) {
  const batch = entries.slice(i, i + 4);
  const results = await Promise.allSettled(batch.map(([rel, url]) => download(rel, url)));
  for (const r of results) {
    if (r.status === 'fulfilled') { done++; console.log('ok', r.value); }
    else { failed.push(r.reason.message); console.error('FAIL', r.reason.message); }
  }
}
console.log(`\n${done}/${entries.length} downloaded, ${failed.length} failed`);
