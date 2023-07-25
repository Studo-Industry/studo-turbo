import React from 'react'
import { api } from '~/utils/api'

const Mentors = () => {
    const {data:mentorData,status:mentorStatus}=api.user.MentorsForAdmin.useQuery()
  return (
    <div>
            <div>
                <h2 className="mb-6 font-bold">Mentors</h2>
                <table className="table-fixed border-collapse rounded-lg border-2 shadow-custom">
                    <thead className="border-collapse border-2  p-4">
                        <th className="border-collapse border-2  p-4">Username</th>
                        <th className="border-collapse border-2  p-4">College</th>
                        <th className="border-collapse border-2  p-4">Email</th>
                        <th className="border-collapse border-2  p-4">Contact</th>
                    </thead>

                    {mentorData?.map((mentor) => (
                        <tbody key={mentor.id} className="border-collapse border-2  p-4">
                            <td className="border-collapse border-2  p-4">
                                {mentor.firstName && mentor.lastName ? <>{mentor.firstName + ' ' + mentor.lastName}</>
                                : <p className='text-red-500'>Not Provided</p>}
                            </td>
                            <td className="border-collapse border-2  p-4">{mentor.college ? <>{mentor.college}</> : <p className='text-red-500'>Not Provided</p>}</td>
                            <td className="border-collapse border-2  p-4">
                                {mentor.email}
                            </td>
                            <td className="border-collapse border-2  p-4">
                            {mentor.contact ? <>{Number(mentor.contact)}</> : <p className='text-red-500'>Not Provided</p>}
                            </td>
                        </tbody>
                    ))}
                </table>
            </div>
        </div>
  )
}

export default Mentors