import { redirect } from "next/navigation";

// 重定向到文章列表页作为首页
export default function RootPage() {
  redirect("/posts");
  return null;
}