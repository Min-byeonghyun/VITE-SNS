import logo from "@/assets/logo.png"

export default function GlobalLoader() {
  return <div className="flex flex-col items-center justify-center bg-muted h-[100vh] w-[100vw]">
    <div className="flex items-center gap-4 mb-15 animate-bounce">
      <img src={logo} alt="sns 서비스 로고" className="w-10" />
      <div className="text-2xl font-bold">BITE-SNS</div>
    </div>
  </div>
}