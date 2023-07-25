import React from 'react'
import { api } from '~/utils/api'

const Users = () => {
    const { data: userData, status: userStatus } = api.user.UsersForAdmin.useQuery();
    return (
        <div>
            <div>
                <h2 className="mb-6 font-bold">Users</h2>
                <table className="table-fixed border-collapse rounded-lg border-2 shadow-custom">
                    <thead className="border-collapse border-2  p-4">
                        <th className="border-collapse border-2  p-4">Username</th>
                        <th className="border-collapse border-2  p-4">College</th>
                        <th className="border-collapse border-2  p-4">Email</th>
                        <th className="border-collapse border-2  p-4">Contact</th>
                    </thead>

                    {userData?.map((user) => (
                        <tbody key={user.id} className="border-collapse border-2  p-4">
                            <td className="border-collapse border-2  p-4">
                                {user.firstName && user.lastName ? <>{user.firstName + ' ' + user.lastName}</>
                                : <p className='text-red-500'>Not Provided</p>}
                            </td>
                            <td className="border-collapse border-2  p-4">{user.college ? <>{user.college}</> : <p className='text-red-500'>Not Provided</p>}</td>
                            <td className="border-collapse border-2  p-4">
                                {user.email}
                            </td>
                            <td className="border-collapse border-2  p-4">
                            {user.contact ? <>{Number(user.contact)}</> : <p className='text-red-500'>Not Provided</p>}
                            </td>
                        </tbody>
                    ))}
                </table>
            </div>
        </div>
    )
}

export default Users