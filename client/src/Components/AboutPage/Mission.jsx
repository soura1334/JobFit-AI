import { Check } from "lucide-react";

export default function Mission() {
  return (
    <div className="py-15 flex items-center px-10">
      <div className="grid lg:grid-cols-2 gap-15 w-full">
        <HeroImage />
        <div className="flex flex-col gap-10">
          <p className="text-5xl font-bold">What is JobFit AI?</p>
          <p className="text-lg text-gray-800">
            JobFit AI is an intelligent assistant that helps you become
            job-ready — not by guessing, but by understanding. We analyze your
            uploaded resume, identify missing skills for your desired role, and
            recommend exactly what you need to learn to stay ahead. Plus, we
            fetch real-time job openings using the Adzuna API — so you're not
            just preparing, you're applying smartly.
          </p>
          <CheckList />
        </div>
      </div>
    </div>
  );
}

function HeroImage() {
  return (
    <div className="flex items-center">
      <img src="/dashboard.png" className="shadow-2xl rounded-lg"></img>
    </div>
  );
}

function CheckList() {
  return (
    <ul className="flex flex-col gap-4">
      <CheckListItem>Skill gap detection</CheckListItem>
      <CheckListItem>Resume analysis</CheckListItem>
      <CheckListItem>Job recommendations</CheckListItem>
    </ul>
  );
}

function CheckListItem({ children }) {
  return (
    <li className="flex gap-2">
      <div className="bg-green-500 w-6 h-6 rounded-full flex justify-center items-center">
        <Check size={15} color="white" />
      </div>
      <p className="text-gray-700">{children}</p>
    </li>
  );
}
