import {
  AtSign,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";

export default function FormArea() {
  return (
    <div className="lg:grid grid-cols-3 grid-rows-3 flex flex-col p-5 gap-5 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <ContactArea />
      <FormContent />
      <LinkArea />
    </div>
  );
}

function ContactArea() {
  return (
    <div className="row-span-2 rounded-lg bg-white shadow-xl p-5">
      <h3 className="text-xl font-bold text-[#ac1dbf] lg:mb-0 mb-5">
        Get in Touch
      </h3>
      <div className="flex flex-col h-full justify-center gap-10">
        <ContactItem
          comp={<Mail color="#9e51a9" size={20} />}
          header="Email Us"
          link="mailto:jobfitai@gmail.com"
        >
          <p className="text-[#ac1dbf]">jobfitai@gmail.com</p>
        </ContactItem>
        <ContactItem
          comp={<Phone color="#9e51a9" size={20} />}
          header="Call Us"
          link="tel:+911800-123-4567"
        >
          <p className="text-[#ac1dbf]">+91 1800-123-4567</p>
          <p className="text-sm text-gray-500">Mon-Fri, 24x7</p>
        </ContactItem>
        <ContactItem
          comp={<MapPin color="#9e51a9" size={20} />}
          header="Visit Us"
          link="https://maps.app.goo.gl/PqRhSqFXPsNuJsxf8"
        >
          <p className="text-sm text-gray-500">Kalyani, West Bengal 741235</p>
        </ContactItem>
      </div>
    </div>
  );
}

function ContactItem({ comp, children, header, link }) {
  return (
    <a href={link} className="flex gap-4">
      <div className="bg-purple-100 rounded-full w-10 h-10 flex justify-center items-center ">
        {comp}
      </div>
      <div>
        <p className="font-semibold">{header}</p>
        {children}
      </div>
    </a>
  );
}

function LinkArea() {
  return (
    <div className="rounded-lg  bg-white shadow-xl p-5">
      <h3 className="text-xl font-bold text-[#ac1dbf]">Connect with Us</h3>
      <div className="flex gap-5 h-full items-center p-5">
        <a
          href="https://x.com/#"
          className="bg-white border-2 rounded-full w-12 h-12 flex justify-center items-center "
        >
          <img src="/x.svg" className="bg-black h-6 p-1" />
        </a>
        <a
          href="https://instagram.com/#"
          className="bg-white border-2 border-[#E1306C] rounded-full w-12 h-12 flex justify-center items-center "
        >
          <Instagram color="#E1306C" />
        </a>
        <a
          href="https://linkedin.com/#"
          className="bg-white border-2 border-blue-700 rounded-full w-12 h-12 flex justify-center items-center "
        >
          <Linkedin color="blue" />
        </a>
        <a
          href="https://facebook.com/#"
          className="bg-white border-2 border-blue-700 rounded-full w-12 h-12 flex justify-center items-center "
        >
          <Facebook color="blue" />
        </a>
      </div>
    </div>
  );
}

function FormContent() {
  return (
    <div className="row-span-3 col-span-2 rounded-lg bg-white shadow-xl p-10">
      <h3 className="text-2xl font-bold text-[#ac1dbf] mb-6">
        Send Us a Message
      </h3>
      <form className="flex flex-col lg:grid grid-cols-2 gap-6">
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-semibold">
            Your Name
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-indigo-500">
            <User color="#9ca3af" size={20} />
            <input
              name="name"
              id="name"
              type="text"
              className="w-full outline-none bg-transparent"
              placeholder="User Name"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-semibold">
            Your Email
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-indigo-500">
            <AtSign color="#9ca3af" size={20} />
            <input
              name="email"
              id="email"
              type="email"
              className="w-full outline-none bg-transparent"
              placeholder="example@email.com"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1 col-span-2">
          <label htmlFor="subject" className="font-semibold">
            Subject
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-indigo-500 w-full overflow-hidden">
            <MessageSquare color="#9ca3af" size={20} />
            <select
              id="subject"
              name="subject"
              className="appearance-none w-full min-w-0 outline-none bg-white text-gray-700"
            >
              <option>General Enquiry</option>
              <option>Technical Support</option>
              <option>Account Issue</option>
              <option>Feature Request</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div className="col-span-2 flex flex-col gap-1">
          <label htmlFor="message" className="font-semibold">
            Your Message
          </label>
          <div className="border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
            <textarea
              id="message"
              name="message"
              className="w-full h-24 outline-none bg-transparent resize-none"
              placeholder="Enter your message"
            />
          </div>
        </div>

        {/* Button */}
        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-md bg-blue-600 text-white font-semibold shadow-xl hover:bg-blue-700 transition-all"
          >
            <Send color="white" size={20} />
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
}
