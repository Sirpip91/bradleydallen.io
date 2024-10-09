import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsAndConditions() {
  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Terms &amp; Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p>
          By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Content Copyright Policy</h2>
        <p>
          The site design, logo, and content are subject to copyright &copy; 2023-present | Bradley Allen
        </p>
        <p>
          User contributions licensed under CC by-SA 3.0 with attribution required.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Memberships</h2>
        <p>
          <strong>Billing:</strong> Subscription fees for the PRO Membership are recurring payments (except where identified as otherwise, such as the Lifetime Membership and Single Course Purchases). The term may be monthly, quarterly, or annual, as described in the course of the transaction. Your subscription begins upon payment of the first installment of subscription fees. The subscription renews at the specified interval as applicable upon the payment of automatically recurring subscription fees. Monthly or annual fees are charged on the same day of the month that the subscription began. (For example, if a monthly subscription begins on the 29th, 30th, or 31st day of a month, then membership will renew on the last day of any month that doesn&apos;t have that many days.)
        </p>
        <p>
          <strong>Cancellations and Refunds:</strong> You can cancel your PRO Membership at any time. If you purchase a subscription that automatically renews, you may cancel the subscription any time before the end of the current billing period, and the cancellation will take effect immediately.
        </p>
        <p>
          <strong>Lapsed Payment:</strong> If payment for a subscription fails, the user account will be downgraded and granted a 7-day grace period to update the payment source. If a successful payment is not made within 7 days, the membership will be fully canceled, and renewal will be subject to current prices.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Refund Policy</h2>
        <p>
          We offer a 30-day money-back guarantee on all PRO Memberships. If you are not satisfied with your membership, you may request a refund within 30 days of the original purchase date by emailing support@bradleydallen.io
        </p>

        <h2 className="text-2xl font-semibold mt-6">Disclaimer</h2>
        <p>
          The materials on the bradleydallen.io website are provided &quot;as is&quot;. bradleydallen.io makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, bradleydallen.io does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Internet website or otherwise relating to such materials or on any sites linked to this site.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Limitations</h2>
        <p>
          In no event shall bradleydallen.io be liable for any damages (including, without limitation, damages for loss of data or profit or due to business interruption) arising out of the use or inability to use the materials on the bradleydallen.io Internet site, even if bradleydallen.io or a bradleydallen.io authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Intellectual Property Rights</h2>
        <p>
          bradleydallen.io is committed to protecting intellectual property rights. bradleydallen.io strictly follows DMCA guidelines for unauthorized use of copyrighted material. Any inquiries regarding the reproduction of the content on this site must be directed to the party holding the proprietary rights to the specified content. You shall not distribute, publish, transmit, modify, display or create derivative works from material obtained with this service. To file a notice of copyright infringement with bradleydallen.io, you will need to provide a written communication that follows the guidelines set in Section 512(c)(3) of the Digital Millennium Copyright Act (the &quot;DMCA&quot;).
        </p>

        <h2 className="text-2xl font-semibold mt-6">Governing Law</h2>
        <p>
          Any claim relating to the bradleydallen.io website shall be governed by the laws of the State of Texas without regard to its conflict of law provisions. General Terms and Conditions apply to the Use of a Web Site.
        </p>
      </CardContent>
    </Card>
  )
}
