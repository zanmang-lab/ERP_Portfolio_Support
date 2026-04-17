This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Share on the internet (GitHub + Vercel)

1. Create a new empty repository on GitHub (no README), then from this project folder run:
   ```bash
   git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```
   (If your default branch is `master`, either push with `git push -u origin master` or rename with `git branch -M main` first.)

2. Sign in to [Vercel](https://vercel.com), choose **Add New… → Project**, and **Import** the GitHub repository.

3. Leave the default **Framework Preset: Next.js** and **Build Command: `next build`**, then click **Deploy**.

4. **기업마당 공공지원 목록(실데이터)** 을 프로덕션에서 쓰려면 Vercel 프로젝트 **Settings → Environment Variables** 에 `BIZINFO_CRTFC_KEY` 를 추가하세요. 값은 기업마당에서 발급한 서비스키이며, **Production**(필요 시 **Preview**)에 체크한 뒤 저장합니다. 변수를 추가·수정한 뒤에는 **Deployments** 에서 최신 배포를 **Redeploy** 하거나 빈 커밋을 푸시해 다시 빌드해야 서버 라우트에 반영됩니다. (`NEXT_PUBLIC_` 접두어는 사용하지 마세요. 키가 클라이언트 번들에 포함될 수 있습니다.)

5. When the build finishes, copy the production URL (for example `https://your-repo.vercel.app`) and share it. Further `git push` to the connected branch will redeploy automatically.
