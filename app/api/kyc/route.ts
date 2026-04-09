import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId, firstName, lastName, nationality, sourceOfWealth } = data;

    if (!userId || !firstName || !lastName || !nationality) {
      return NextResponse.json(
        { error: 'Missing required KYC parameters.' },
        { status: 400 }
      );
    }

    // Simulate connection to IDnow / SumSub / Jumio API for AML and PEP checks
    // In production, this would be a webhook listener receiving a payload from the KYC provider.
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Simulated PEP (Politically Exposed Person) Sanction List Check
    // We mock a failure based on a specific name/nationality for demo purposes
    const isPEP = lastName.toLowerCase() === 'pep' || nationality === 'SY';
    const isSanctioned = sourceOfWealth === 'unknown';

    if (isSanctioned) {
      return NextResponse.json({
        success: false,
        status: 'REJECTED',
        reason: 'Failed Anti-Money-Laundering (AML) checks.',
        timestamp: new Date().toISOString(),
      });
    }

    if (isPEP) {
      // Human-in-the-Loop Email Trigger
      try {
        const { sendApprovalEmail } = await import("@/lib/email");
        await sendApprovalEmail("kyc", userId, {
          name: `${firstName} ${lastName}`,
          nationality,
          reason: "PEP or High-Risk setup flagged during B2B onboarding."
        });
      } catch (e) {
        console.error("Failed to trigger HITL email", e);
      }

      return NextResponse.json({
        success: true,
        status: 'MANUAL_REVIEW',
        reason: 'Flagged as Politically Exposed / High-Risk (PEP). Requires manual AML/Compliance review.',
        pepFlag: true,
        timestamp: new Date().toISOString(),
      });
    }

    // Success Path
    return NextResponse.json({
      success: true,
      status: 'VERIFIED',
      provider: 'IDnow (Simulated)',
      amlCheck: 'Passed',
      pepFlag: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal KYC Provider integration error.' },
      { status: 500 }
    );
  }
}
