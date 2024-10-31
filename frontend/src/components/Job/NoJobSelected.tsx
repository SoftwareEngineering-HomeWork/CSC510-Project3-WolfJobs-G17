const NoJobSelected = () => {
  return (
    <>
      <div
        className="flex justify-center items-center"
        style={{ height: "calc(100vh - 100px)" }}
      >
        <div className="flex items-center gap-5">
          <div className="h-12 w-12 -m-1 mb-0">
            <img src="images/eva_slash-outline.svg" />
          </div>
          <div>
          <p className="text-[#696969]">Nothing to show!</p>
          <p className="text-[#696969]">Select a job for more details</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoJobSelected;
