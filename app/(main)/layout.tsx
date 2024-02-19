import TabBar from "@/components/TabBar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="w-dvw h-dvh overflow-y-auto pb-[50px]">{children}</div>
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-300">
        <TabBar />
      </div>
    </>
  );
}
