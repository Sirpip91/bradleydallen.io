import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    // Ensure userId is provided
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

            // Delete from one_time_payments table
            const { error: deletePaymentError } = await supabaseAdmin
            .from('one_time_payments')
            .delete()
            .eq('user_id', userId);

        if (deletePaymentError) {
            console.error('Error deleting user from one_time_payments table:', deletePaymentError);
            return NextResponse.json({ error: deletePaymentError.message }, { status: 500 });
        }



        // delete stripe customer first then auth.
        const { error: deleteStripeError } = await supabaseAdmin
        .from('stripe_customers')
        .delete()
        .eq('user_id', userId);
  
      if (deleteStripeError) {
        console.error('Error deleting user from stripe_customers table:', deleteStripeError);
        return NextResponse.json({ error: deleteStripeError.message }, { status: 500 });
      }
      

    // Use Supabase Auth API to delete the user
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in delete user API:', error);
    return NextResponse.json({ error: "ppop" }, { status: 500 });
  }
}
