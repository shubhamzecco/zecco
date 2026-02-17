import SidebarLayout from '@/components/layouts/sidebar-layout'
import React from 'react'
import UserForm from './components/user-form'

const UserProfile = () => {
    return (
        <SidebarLayout>
            <div className="px-12  pt-12 pb-4 mb-10
                            bg-gradient-to-r
                        from-[#60A5FA]/10
                        via-[#fafafa] via-[70%]
                        to-[#fafafa] to-[100%]">
                <UserForm />
            </div>
        </SidebarLayout>
    )
}

export default UserProfile
