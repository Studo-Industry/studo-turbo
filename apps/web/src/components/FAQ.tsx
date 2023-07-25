import React, { useState } from 'react'
import Button from './Button'
import { BiDownArrow, BiRightArrow, BiSolidDownArrow, BiSolidRightArrow } from 'react-icons/bi'

const questions = [
  'How does Studoindustry work?',
  'What are the benefits of participating in projects on Studoindustry?',
  'How can I join Studoindustry as a student?',
  'Are there any specific eligibility criteria to participate in projects?',
  'How do I find and apply for projects on Studoindustry?',
  'Can I choose projects from a specific industry or field?',
  'How long do the projects typically last? ',
  'What kind of support can I expect from Studoindustry during my project?',
  'Can I work on projects individually or as part of a team?',
  'What happens after I submit my project application?',
  'How are projects assigned to students?',
  'Can I communicate with industry professionals while working on the project?',
  'Will I receive any certification or recognition for completing a project?',
  'How can I showcase my project work to potential employers?',
  'Can Studoindustry help me in finding internship or job opportunities?',
  'What should I do if I encounter difficulties or challenges during the project?',
  'Can I collaborate with other students on projects?',
  'What happens if I cannot complete the project within the given timeline?',
  'How does Studoindustry ensure the quality and relevance of the projects offered?',
]

const answers = [
  'Studoindustry connects students with real-world projects from industries. It compares more than 1 000 of projects from Various industries, Students can apply for projects, work on them, and gain practical experience',
  'Participating in projects on Studoindustry helps students learn realworld skills, gain practical experience, and network with industry professionals. It also provides valid certification from industry after the complete course of project',
  'You can join Studoindustry as a student by creating an account on our website and filling out your profile. Then, you can explore and apply for all projects. An after enrolling for your choice of project it provides more information of same in detail manner',
  'Eligibility criteria may vary depending on the project and industry requirements. Generally, students from various academic backgrounds can participate. Group consisting of 4 engineering students followed by one institute mentor can apply for projects',
  'You can find projects on the Studoindustry website by browsing through the available listings. Once you find a project of interest, you can submit your application.',
  'Yes, Studoindustry offers projects from various industries such as engineering, technology, design, and more. You can choose projects based on your preferred industry or field.',
  'The duration of projects can vary. Some projects may last a 2-3 months, while others may span several months. The project listings provide details about the estimated duration.',
  'Studoindustry provides support by connecting students with industry professionals who serve as mentors. They can offer guidance and answer questions throughout the project. Also College guides/mentors will be there for you',
  'You may have as part of a team. This depends on the project requirements and collaboration opportunities available.',
  'After submitting your project application, it will be reviewed by the industry partner. If selected, you will be notified and provided with further instructions to start the project.',
  `Projects are typically assigned based on the industry partner's preferences and the qualifications and skills of the students. The industry partner selects the most suitable candidates.`,
  'Yes, you can communicate with industry professionals assigned to your project. They can provide guidance, feedback, and support during the project duration.',
  'Depending on the project and industry partner, you may receive a certification or recognition for your participation and successful completion of the project',
  'Studoindustry provides a platform for you to showcase your project work. You can include project details, outcomes, and any relevant documentation in your profile or portfolio.',
  'Yes, participating in projects on Studoindustry can enhance your skills and industry connections, which may lead to internship or job opportunities in the future. Also depending on teams involvement in completion of industrial projects, those groups will get highlighted on our website so as to provide job opportunities/placements for participated students',
  'If you encounter difficulties or challenges during the project, you can reach out to your project mentor or Studoindustry support for assistance and guidance.',
  'Collaboration with other students may be possible depending on the project and its requirements. You can explore the project details to see if collaboration is encouraged.',
  'If you face difficulties in completing the project within the given timeline, it is important to communicate with your project mentor or the Studoindustry team to discuss possible solutions or adjustments.',
  'Studoindustry partners with renowned companies and industry professionals to offer high-quality projects. The projects undergo a review process to ensure their relevance and alignment with industry standards.'
]

const FAQ = ({ que }: { que: number }) => {
  const [showAnswer, setShowAnswer] = useState(false)
  return (
    <div className='shadow-md m-10 p-6 font-medium'>
      <button className=' flex flex-row items-center gap-4 rounded-md transition-all' onClick={() => setShowAnswer(!showAnswer)}>{que+1+"."} {questions[que]}{showAnswer ? (<BiSolidDownArrow/>) :  (<BiSolidRightArrow/>)}
      </button>
      {showAnswer && 
        <p className='mx-4 py-4'>Ans: {answers[que]}</p>
      }
    </div>
  )
}

export default FAQ