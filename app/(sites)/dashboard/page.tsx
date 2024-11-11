const Page = async () => {
  const data = await fetch("https://jsonplaceholder.typicode.com/users");
  return (
    <div className="">
      <h1>Dashboard page</h1>
    </div>
  );
};

export default Page;
