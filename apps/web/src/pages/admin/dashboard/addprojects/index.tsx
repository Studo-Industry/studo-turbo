import { type ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { env } from "~/env.mjs";

const options = [
  "Computer science engineering",
  "Information technology engineering",
  "Electrical engineering",
  "Electronics engineering",
  "Mechanical engineering",
  "Civil engineering",
  "Electrical vehicle (EV) engineering",
  "Electronic & communication engineering",
  "Biomedical engineering",
  "Agricultural engineering",
  "Mechatronics engineering",
  "Production engineering",
  "Textile engineering",
  "Automobile engineering",
  "Biochemical engineering",
  "Biotechnology engineering",
  "Cyber security engineering",
  "Instrumentation technology engineering",
];
const Home = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [features, setFeatures] = useState<string>("");
  const [components, setComponents] = useState<string>("");
  const [implementation, setImplamentation] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
  const [video, setVideo] = useState<string>("");
  const [relatedInfo, setRelatedInfo] = useState<string>("");
  const [specifications, setSpecifications] = useState<string>("");
  const [isPaid, setIsPaid] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  const image = api.project.imageUpload.useMutation();
  const addProject = api.project.createProject.useMutation();
  const uploadToS3 = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    const fileType = file.type;
    const { uploadUrl, key } = await image.mutateAsync({
      extension: fileType,
    });

    const responseAWS = await fetch(uploadUrl, {
      body: file,
      method: "PUT",
    });

    if (responseAWS.ok === true) {
      setImages((prevValue) => [...prevValue, `${key}`]);
    }
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title !== "" && description !== "" && company !== "") {
      await addProject
        .mutateAsync({
          title,
          description,
          company,
          features,
          tags,
          categories,
          images,
          components,
          implementation,
          skills,
          specifications,
          relatedInfo,
          videoLink: video,
          paidProject: isPaid,
        })
        .then(() => {
          setTitle("");
          setDescription("");
          setCompany("");
          setFeatures("");
          setVideo("");
          setTags([]);
          setCategories([]);
          setImages([]);
          setComponents("");
          setImplamentation("");
          setSkills("");
          setSpecifications("");
          setRelatedInfo("");
          setVideo("");
          setIsPaid(false);
          toast.success("Successfully Added");
        });
    } else {
      toast.error("Please fill in the details properly.");
    }
  };
  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const tagValue = inputValue.trim();
      if (tags.includes(tagValue)) return;
      if (tagValue) {
        setTags([...tags, tagValue]);
      }
      setInputValue("");
      event.preventDefault();
    }
  };

  const AddImage = ({
    onImageSelect,
  }: {
    onImageSelect: (file: File) => void;
  }) => {
    const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onImageSelect(file);
      }
    };
    return (
      <div className="flex flex-col">
        <label htmlFor="file">Upload Image:</label>
        <input
          className="rounded-md p-2 focus:outline-none"
          type="file"
          accept="image/jpg,image/png,image/jpeg"
          name="file"
          onChange={handleImageSelect}
        />
      </div>
    );
  };

  const ImageUpload = () => {
    return (
      <div className="flex flex-col">
        <label> Images:</label>
        {images.map((key) => (
          <div
            key={key}
            className="m-2 flex items-center justify-between gap-4 rounded-md bg-white px-4 py-2 text-black"
          >
            <div className="flex items-center gap-4">
              <img
                width={60}
                className="rounded-md"
                src={`${env.NEXT_PUBLIC_AWS_S3}${key}`}
              />
              <span>Image Uploaded</span>
            </div>
            <div
              className="cursor-pointer font-bold"
              onClick={() =>
                setImages((prevValue) => prevValue.filter((val) => val !== key))
              }
            >
              X
            </div>
          </div>
        ))}
      </div>
    );
  };
  if (sessionStatus === "loading")
    return (
      <div className="flex-center flex min-h-[60vh] w-full items-center justify-center align-middle text-2xl ">
        <h3>Loading...</h3>
      </div>
    );

  if (sessionStatus === "unauthenticated") {
    void router.push("/login");
  }

  return (
    <>
      <main className="flex flex-col bg-gray-100 px-10 py-16">
        <h1 className="text-2xl font-semibold">Hi {session?.user.name}!</h1>
        <form
          onSubmit={(event) => void submitForm(event)}
          className="my-8 flex w-full flex-col gap-8 px-4 md:grid md:grid-cols-5 md:px-16"
        >
          <h3 className=" col-span-5 text-xl font-bold">Create a Project</h3>
          <div className="col-span-2 flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="title">
                Title:<span className="font-bold text-red-500"> * </span>
              </label>
              <input
                className="rounded-md p-2 text-black shadow-2xl focus:outline-none"
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description">
                Brief Description:
                <span className="font-bold text-red-500"> * </span>
              </label>
              <textarea
                className="rounded-md p-2 text-black shadow-2xl focus:outline-none"
                name="description"
                id="description"
                rows={8}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="features">Features:</label>
              <textarea
                className="rounded-md p-2 text-black shadow-2xl focus:outline-none"
                name="features"
                id="features"
                rows={8}
                value={features}
                onChange={(event) => setFeatures(event.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="company">Video Link:</label>
              <input
                className="rounded-md p-2 text-black shadow-2xl focus:outline-none"
                type="text"
                name="video"
                id="video"
                value={video}
                onChange={(event) => setVideo(event.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="company">
                Company:<span className="font-bold text-red-500"> * </span>
              </label>
              <input
                className="rounded-md p-2 text-black shadow-2xl focus:outline-none"
                type="text"
                name="company"
                id="company"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
              />
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="paid">
                Paid Project:<span className="font-bold text-red-500"> * </span>
              </label>
              <input
                className="h-10 w-10"
                type="checkbox"
                checked={isPaid}
                onChange={() => setIsPaid((prevValue) => !prevValue)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="category">Categories:</label>
              <div className="m-2 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-md bg-white p-2 text-black"
                  >
                    #{category}{" "}
                    <span
                      className="cursor-pointer rounded-md bg-black/50  p-1 text-xs text-white"
                      onClick={() =>
                        setCategories((prevValue) =>
                          prevValue.filter((val) => val !== category)
                        )
                      }
                    >
                      X
                    </span>
                  </span>
                ))}
              </div>
              <select
                className="rounded-md p-2 text-black shadow-2xl focus:outline-none"
                id="category"
                name="category"
                value={selectedOption}
                onChange={(event) => {
                  setSelectedOption(event.target.value);
                  if (categories.includes(event.target.value)) return;
                  setCategories((prevValue) => [
                    ...prevValue,
                    event.target.value,
                  ]);
                }}
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="tags">Tags:</label>
              <div className="m-2 flex flex-wrap  gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-white p-2 text-black"
                  >
                    #{tag}{" "}
                    <span
                      className="cursor-pointer rounded-md bg-black/50  p-1 text-xs text-white"
                      onClick={() =>
                        setTags((prevValue) =>
                          prevValue.filter((val) => val !== tag)
                        )
                      }
                    >
                      X
                    </span>
                  </span>
                ))}
              </div>
              <input
                className="rounded-md p-2 text-black shadow-2xl focus:outline-none"
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tags"
              />
            </div>
            <div>
              {images.length !== 0 && <ImageUpload />}
              <AddImage onImageSelect={(file: File) => void uploadToS3(file)} />
            </div>
          </div>
          <div></div>
          <div className="col-span-2 flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="components">Components:</label>
              <textarea
                className="rounded-md p-2 text-black shadow-2xl focus:outline-none"
                name="components"
                id="components"
                rows={8}
                value={components}
                onChange={(event) => setComponents(event.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="specifications">Specifications:</label>
              <textarea
                className="rounded-md p-2 text-black shadow-2xl focus:outline-none"
                name="specifications"
                id="specifications"
                rows={8}
                value={specifications}
                onChange={(event) => setSpecifications(event.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="implementation">Implementation:</label>
              <textarea
                className="rounded-md p-2 text-black shadow-2xl focus:outline-none"
                name="implementation"
                id="implementation"
                rows={8}
                value={implementation}
                onChange={(event) => setImplamentation(event.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="skills">Skills:</label>
              <textarea
                className="rounded-md p-2 text-black shadow-2xl focus:outline-none"
                name="skills"
                id="skills"
                rows={8}
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="related">Related Information:</label>
              <textarea
                className="rounded-md p-2 text-black shadow-2xl focus:outline-none"
                name="related"
                id="related"
                rows={8}
                value={relatedInfo}
                onChange={(event) => setRelatedInfo(event.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="col-span-5 rounded-md bg-black px-4 py-2 font-bold text-white"
          >
            Submit
          </button>
        </form>
      </main>
    </>
  );
};

export default Home;
