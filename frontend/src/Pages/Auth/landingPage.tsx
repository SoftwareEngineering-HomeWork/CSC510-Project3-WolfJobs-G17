import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="md:flex-row flex-col flex justify-around items-center">
    <div className="px-5 mt-5 md:w-1/3">
    <div
      className="font-semibold md:text-[40px] text-4xl leading-[48px] text-black"
    >
      We understand that being a student can be{" "}
      <span style={{ color: "#FF5353" }}>challenging.</span>
    </div>

    <div
      className="font-normal text-[20px] leading-[24px] text-[#666666] my-4"
    >
      Join our dynamic team right here on campus. Earn, learn, and be part of
      the community that powers your daily essentials. Apply now and shape
      your campus experience!
    </div>
    <div className="flex items-center gap-5 py-2">
    <button
      onClick={(e) => {
        e.preventDefault();
        navigate("/register");
      }}
      type="button"
      className="whitespace-nowrap flex-1 px-12 py-4 font-semibold text-[20px] leading-[24px] text-white bg-[#FF5353] rounded-[10px] flex items-center justify-center hover:bg-[#ff5366]"
    >
      {/* <p
        className=""
      > */}
        Sign Up
      {/* </p> */}
    </button>

    <p
      className="font-poppins font-medium text-[20px] leading-[30px] text-center text-[#8C8D90]"
    >
      OR
    </p>

    <button
      onClick={(e) => {
        e.preventDefault();
        navigate("/login");
      }}
      type="button"
      className="flex-1 px-12 py-4 bg-white border border-[#656565] rounded-[10px] font-semibold text-[20px] leading-[24px] m-0 text-[#656565] hover:border-[#ff5353] hover:text-[#ff5353]"
    >
      {/* <p
        className=" hover:text-[#ff5353]"
      > */}
        Login
      {/* </p> */}
    </button>
    </div>
    </div>
    <div className="order-1 md:order-2 flex justify-between items-center relative">
    {/* <div
      className="w-[735px] h-[752px] -top-16 -left-[560px] absolute -z-10"
    >
      <img className="w-full h-full object-cover" src="/images/landingpage_image1.png" alt="Landing Page Image" />
    </div> */}

    <div
      className="w-[420px] h-[640px]"
    >
      <img className="w-full h-full object-cover" src="/images/landingpage_image2.png" alt="Landing Page Image" />
    </div>
    </div>
  </div>
  );
};

export default LandingPage;
