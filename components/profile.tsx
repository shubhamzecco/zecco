interface IProfileAvtar {
    name : string;
    className?: string
}

const ProfileAvatar = ({ name , className} : IProfileAvtar) => {

    const getInitialsFromFullName = (name: string): string => {
        const parts = name.trim().split(" ");
        const first = parts[0]?.charAt(0) || "";
        const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";

        return `${first}${last}`.toUpperCase();
    };

    const initials = getInitialsFromFullName(name);

    return (
        <div className={`w-9 h-9 rounded-full bg-[#F1F5F9] text-text_gray_color
                    flex  items-center justify-center text-md font-inter font-bold ${className}`}>
            {initials}
        </div>
    );
};

export default ProfileAvatar