import { Injectable, OnModuleInit } from '@nestjs/common';
import { parse } from 'node-html-parser';
import { Browser, launch, Page, Puppeteer } from 'puppeteer';
import { IMentoring } from '../../common/interfaces/soma.interface';
import { Lock } from '../../common/utils/lock';
import { promisify } from 'util';
import { MentoringService } from './mentoring.service';
import { EventEmitter2 } from 'eventemitter2';

@Injectable()
export class CrawlerService implements OnModuleInit {
  private browser: Browser;
  private page: Page;
  private readonly lock: Lock = new Lock();
  private loggedIn = false;
  private readonly sleepPromise = promisify(setTimeout);
  constructor(
    private readonly mentoringsService: MentoringService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async onModuleInit(): Promise<void> {
    return this.initialize();
  }

  async initialize(): Promise<void> {
    this.browser = await launch({
      ignoreHTTPSErrors: true,
      headless: true,
      defaultViewport: { width: 1000, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });
    this.page = await this.browser.newPage();
    this.page.on('dialog', async (dialog) => {
      const _message: string = dialog.message() || '';
      if (_message.startsWith('로그인이 필요한 페이지입니다.')) {
        this.loggedIn = false;
      }
      await dialog.dismiss();
    });
    if (process.env.NODE_ENV !== 'test')
      setTimeout(this.startCheckingNewMentoringsRoutine, 2000);
  }

  async startCheckingNewMentoringsRoutine(): Promise<void> {
    const rescentLocalMentoring =
      (await this.mentoringsService.getMostRecentMentoring()) || { id: 0 };
    const rescentOnlineMentoring = (await this.fetchMentorings())[0];
    if (
      rescentOnlineMentoring &&
      rescentLocalMentoring &&
      rescentOnlineMentoring.id > rescentLocalMentoring.id
    ) {
      console.log('New mentoring exist');
      const newMentorings: IMentoring[] = [];
      let i = 1;
      while (true) {
        console.log(i);
        const mentorings = await this.fetchMentorings(i++);
        const newMentoringsPartial = mentorings.filter(
          (m) => m.id > rescentLocalMentoring.id,
        );
        if (newMentoringsPartial.length === 0) break;
        newMentoringsPartial.forEach((m) => newMentorings.push(m));
      }
      console.log(`new: ${newMentorings.length}`);
      for (const newMentoring of newMentorings) {
        const { content, mentoringLocation } = await this.fetchMentoringDetails(
          newMentoring.id,
        );
        newMentoring.content = content;
        newMentoring.mentoringLocation = mentoringLocation;
        await this.mentoringsService.create(newMentoring);
        await this.sleepPromise(400);
        this.eventEmitter.emit('new_mentoring', newMentoring);
      }
    }
    if (process.env.NODE_ENV !== 'test')
      setTimeout(this.startCheckingNewMentoringsRoutine, 60 * 1000);
  }

  addNewMentoringListener(listener: () => void) {
    this.eventEmitter.on('new_mentoring', listener);
  }

  async fetchMentoringDetails(
    id: number,
  ): Promise<{ mentoringLocation: string; content: string }> {
    const html: string = await this.getHtml(
      `https://www.swmaestro.org/sw/mypage/mentoLec/view.do?qustnrSn=${id}&menuNo=200046`,
    );
    const root = parse(html);
    return {
      mentoringLocation: root.querySelectorAll('div.c')[4].textContent.trim(),
      content: root.querySelector('div.cont').textContent.trim(),
    };
  }

  async fetchAllMentorings(): Promise<IMentoring[]> {
    const retMentorings: IMentoring[] = [];
    let i = 1;
    while (true) {
      const mentorings = await this.fetchMentorings(i);
      if (mentorings.length === 0) break;

      mentorings.forEach((m) => retMentorings.push(m));
      await this.sleepPromise(500);
      i++;
    }
    return retMentorings;
  }

  async fetchMentorings(pageIndex = 1): Promise<IMentoring[]> {
    if (pageIndex <= 0) pageIndex = 0;
    const html: string = await this.getHtml(
      `https://www.swmaestro.org/sw/mypage/mentoLec/list.do?menuNo=200046&pageIndex=${pageIndex}`,
    );
    const root = parse(html);
    const [trHeader, ...trs] = root.querySelectorAll('tr');
    if (trs.length > 0 && trs[0].textContent.trim() === '데이터가 없습니다.')
      return [];
    return trs.map((tr) => {
      const mentoring: IMentoring = {
        id:
          parseInt(
            new URL(
              tr.querySelector('a').getAttribute('href'),
              'https://www.swmaestro.org/',
            ).searchParams.get('qustnrSn'),
          ) || -1,
        title: tr.querySelector('a').text.trim(),
        state: tr.querySelector('td:nth-child(6)').textContent.trim(),
        createdAt: new Date(
          tr.querySelector('td:nth-child(8)').textContent.trim(),
        ),
        mentoringDate: new Date(
          tr.querySelector('td:nth-child(4)').textContent.trim(),
        ),
        appliedCnt: parseInt(
          tr.querySelector('td:nth-child(5)').textContent.trim(),
        ),
        writer: tr.querySelector('td:nth-child(7)').textContent.trim(),
        applyStartDate: new Date(
          tr
            .querySelector('td:nth-child(3)')
            .textContent.trim()
            .split('~')[0]
            .trim(),
        ),
        applyEndDate: new Date(
          tr
            .querySelector('td:nth-child(3)')
            .textContent.trim()
            .split('~')[1]
            .trim(),
        ),
      };
      return mentoring;
    });
  }

  private async getHtml(url: string): Promise<string> {
    await this.lock.acquire();
    this.loggedIn = true;
    let res = await this.page.goto(url);
    if (!this.loggedIn) {
      await this.login();
      res = await this.page.goto(url);
    }
    const html = await res.text();
    this.lock.release();
    return html;
  }

  private async isLoggedIn(): Promise<boolean> {
    const res = await this.page.goto(
      'https://www.swmaestro.org/sw/main/main.do',
    );
    const html = await res.text();
    const root = parse(html);
    const loginButton = root.querySelector('button.log_new');
    return loginButton?.getAttribute('title') === '로그아웃';
  }

  private async login(): Promise<boolean> {
    await this.page.goto(
      'https://www.swmaestro.org/sw/member/user/forLogin.do?menuNo=200025',
    );
    await this.page.waitForSelector('input[name=username]');
    await this.page.focus('input[name=username]');
    await this.page.keyboard.type(`${process.env.USERNAME}`);
    await this.page.waitForSelector('input[name=password]');
    await this.page.focus('input[name=password]');
    await this.page.keyboard.type(`${process.env.PASSWORD}`);
    await this.page.$eval('#login_form', (form: any) => form.submit());
    await this.page.waitForNavigation();
    const loggedIn = await this.isLoggedIn();
    if (!loggedIn) throw new Error(`Cannot login!`);
    return loggedIn;
  }
}
