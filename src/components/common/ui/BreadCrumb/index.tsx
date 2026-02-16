
interface BreadCrumbProps {
    pageName: string;
}
const BreadCrumb = ({ pageName }: BreadCrumbProps) => {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-title-md2 font-semibold text-black dark:text-white first-letter:uppercase">
                {pageName ? pageName : 'dashboard'}
            </h2>
            
        </div>
    );
};

export default BreadCrumb;
