import React from 'react'
import { api } from '~/utils/api'

const Admins = () => {
    const {data:adminData,status:adminStatus}=api.user.AdminsForAdmin.useQuery();
  return (
    <div>
            <div>
                <h2 className="mb-6 font-bold">Admins</h2>
                <table className="table-fixed border-collapse rounded-lg border-2 shadow-custom">
                    <thead className="border-collapse border-2  p-4">
                        <th className="border-collapse border-2  p-4">Username</th>
                        <th className="border-collapse border-2  p-4">College</th>
                        <th className="border-collapse border-2  p-4">Email</th>
                        <th className="border-collapse border-2  p-4">Contact</th>
                    </thead>

                    {adminData?.map((admin) => (
                        <tbody key={admin.id} className="border-collapse border-2  p-4">
                            <td className="border-collapse border-2  p-4">
                                {admin.firstName && admin.lastName ? <>{admin.firstName + ' ' + admin.lastName}</>
                                : <p className='text-red-500'>Not Provided</p>}
                            </td>
                            <td className="border-collapse border-2  p-4">{admin.college ? <>{admin.college}</> : <p className='text-red-500'>Not Provided</p>}</td>
                            <td className="border-collapse border-2  p-4">
                                {admin.email}
                            </td>
                            <td className="border-collapse border-2  p-4">
                            {admin.contact ? <>{Number(admin.contact)}</> : <p className='text-red-500'>Not Provided</p>}
                            </td>
                        </tbody>
                    ))}
                </table>
            </div>
        </div>
  )
}

export default Admins