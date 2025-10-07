import { ArrowLeft } from 'lucide-react';
import { signOutAction } from '../auth.action';

export const SignoutButton = () => {
  return (
    <form action={signOutAction}>
      <button className="flex items-center gap-2 text-orange-50 hover:text-orange-200">
        <ArrowLeft size={14} /> Signout
      </button>
    </form>
  );
};
