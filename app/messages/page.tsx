import SidebarLayout from '@/components/layouts/sidebar-layout'
import UserList from './components/user-list'
import UserMessage from './components/user-message'

const MessagePage = () => {

    return (
        <SidebarLayout>
            <div className="px-12  py-8 h-full
                            bg-gradient-to-r
                        from-[#60A5FA]/10
                        via-[#fafafa] via-[70%]
                        to-[#fafafa] to-[100%]">
                <section className="mt-5 mb-6">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="font-bold text-xl mb-4 font-inter text-[#111827]">Messages</h2>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-md grid grid-cols-[0.9fr_1fr] gap-4">
                        <UserList />
                        <UserMessage/>
                    </div>
                </section>
            </div>
        </SidebarLayout>
    )
}

export default MessagePage
