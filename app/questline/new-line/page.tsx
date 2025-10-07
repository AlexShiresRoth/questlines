import PageWrapper from '../components/page-wrapper';
import CreateQuestlineForm from '../components/questline-form';
import Sidebar from '../components/side-bar';

export default async function NewQuestLine() {
  return (
    <main className="flex flex-col w-full">
      <PageWrapper>
        <Sidebar />
        <div className="px-4 md:px-0 flex flex-col gap-4 pt-4 md:pt-0">
          <h1 className="text-4xl font-bold text-orange-50">
            Generate New Questline
          </h1>
          <CreateQuestlineForm />
        </div>
      </PageWrapper>
    </main>
  );
}
