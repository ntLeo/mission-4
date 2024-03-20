import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBase64 } from "../utils/image-helper";
import { CgSpinner } from "react-icons/cg";
import axios from "axios";
import { FaCheck } from "react-icons/fa";

const AiImage = () => {
  // Access the API key
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

  // -------------------    Car types      --------------//
  type CarType = {
    model: string;
    year: number;
    imageUrl: string;
    data: any;  // ???????? 
  };



  // -------------------    State for image and AI response      --------------//
  const [image, setImage] = useState<string>("");
  // const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageInlineData, setImageInlineData] = useState<any>(null);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // -------------------    State for MongoDB     --------------//
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [car, setCar] = useState<CarType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // -------------------    Fetching data from MongoDB     --------------//

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.get(
        `http://localhost:4000/search-all?model=${model}&year=${year}`
      );
      console.log(response.data);
      setCar(response.data);
      setError(null);
    } catch (error) {
      setCar(null);
      setError("This car is not in the database.");
    }
  };

  // -------------------    AI Model to generate content     --------------//

  async function aiRun() {
    setLoading(true);
    setAiResponse(""); //clears any previous AI response
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const result = await model.generateContent([
      "What is in this image?",
      imageInlineData,
    ]);
    // generates content using AI model - two inputs to model, question "what is in this image?" and image data to analyze
    const response = await result.response;
    const text = response.text();
    setAiResponse(text);
    setLoading(false);
  }

  const handleClick = () => {
    
    aiRun();
  };

  // -------------------    Rendering image and file name in DOM      --------------//
  // -------------------------------------------------------------------------------//
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    //event when user selects new image file

    // getting base64 from file to render in DOM
    getBase64(file as File)
      .then((result) => {
        setImage(result);
      })
      .catch((event) => console.log(event));

    // generating content model for Gemini Google AI
    if (file) {
      fileToGenerativePart(file).then((image) => {
        setImageInlineData(image);
      });
    } else {
      console.log("No file selected");
    }
  };

  async function fileToGenerativePart(file: File) {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve((reader.result as string).split(",")[1]);
          // taking base64 data result as string
        } else {
          throw new Error("No result from FileReader");
        }
      };
      reader.readAsDataURL(file);
    });

    return {
      inlineData: {
        data: await base64EncodedDataPromise,
        mimeType: file.type,
      },
    };
  }

  return (
    <section className="w-full mt-2 flex justify-center text-center h-1/2 gap-20">
      {/*-------------------    Section left     -------------------*/}

      <div className="flex flex-col text-center justify-around w-[50rem] h-[36rem]">
        <h1 className="text-xl text-gray-800 drop-shadow-sm">
          Step 1. Find your car
        </h1>

        {/*-------------------    Search form     -------------------*/}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-[15rem] mx-auto gap-1"
        >
          <h3 className="text-lg text-gray-800 drop-shadow-sm">Search form</h3>
          <label className="mr-[0.9rem]">
            Model:
            <input
              className="ml-2 w-20"
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </label>
          <label className="">
            Year:
            <input
              className="ml-2 w-20"
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="shadow-md py-1 w-[6rem] mt-2 mx-auto bg-blue-700/90 text-white rounded-md hover:bg-blue-800/90 hover:scale-105 active:scale-100 transition-all"
          >
            Find Car
          </button>
        </form>
        <h1 className="text-xl text-gray-800 drop-shadow-sm">Result</h1>
        <div className="grid grid-cols-4 grid-rows-2 overflow-y-auto gap-x-2 gap-y-[2rem] p-2 border-[0.1rem] border-gray-800 h-[22rem] rounded-md ">
          {car &&
            car.data &&
            car.data.map((carItem: CarType, index: number) => (
              <div className="flex flex-col" key={index}>
                <h2>{carItem.model}</h2>
                <h3>{carItem.year}</h3>
                <div className="relative">
                  <img
                    className="rounded-[2rem] active:scale-95 cursor-pointer transition-all"
                    src={carItem.imageUrl}
                    alt={carItem.model}
                    onClick={() => {
                      
                      setSelectedImage(prev => prev === index ? null : index)}}
                  />
                  {selectedImage === index && (
                    <div className="absolute top-2 left-4 text-lg">
                      <FaCheck/>
                    </div>
                  )}
                </div>
              </div>
            ))}
          {error && <p>{error}</p>}
        </div>
      </div>

      {/*-------------------    Section right     -------------------*/}

      <div className="flex flex-col text-center justify-around w-[50rem]">
        <h1 className="text-xl text-gray-800 drop-shadow-sm ">
          Step 2. Select or Upload an image
        </h1>
        <h1 className="text-xl text-gray-800 drop-shadow-sm ">
          Upload an image of the car, and our AI will do the rest.
        </h1>
        <div className=" flex flex-col w-[15rem] mx-auto">
          <input
            className="invisible"
            type="file"
            id="img"
            onChange={(e) => handleImageChange(e)}
          />
          <label
            htmlFor="img"
            className="px-1 w-[6rem] border-[0.1rem] shadow-md border-gray-400 rounded-md mx-auto font-medium text-gray-800 hover:bg-blue-300/90 hover:scale-105 active:scale-100 transition-all"
          >
            Select file
          </label>
          <button
            className="shadow-md py-2 w-[10rem] mt-4 mx-auto bg-blue-700/90 text-white rounded-md hover:bg-blue-800/90 hover:scale-110 active:scale-105 transition-all"
            onClick={() => handleClick()}
          >
            Ask Me
          </button>
        </div>
        <div className="flex h-[20rem]">
          <img className="p-4 w-10/12 mx-auto rounded-[2rem]" src={image} />
        </div>
        {loading == true && aiResponse == "" ? (
          <p className=" flex justify-center text-xl text-gray-800 drop-shadow-sm ">
            <CgSpinner className="animate-spin text-2xl mr-1 mt-[0.2rem]" />{" "}
            Loading ...
          </p>
        ) : (
          <div>
            <p className="text-xl text-gray-800 drop-shadow-sm mb-6 mt-[0.45rem] h-8 w-[40rem] mx-auto">
              {aiResponse}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
export default AiImage;
