import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    siteTitle: data.site_title,
    description: data.description,
    whatsappNumber: data.whatsapp_number,
    heroImage: data.hero_image,
    logo: data.logo,
    address: data.address,
    operationalHours: data.operational_hours,
  })
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data: existing } = await supabase.from('settings').select('id').single()

  let result
  if (!existing) {
    const { data, error } = await supabase.from('settings').insert({
      site_title: body.siteTitle,
      description: body.description,
      whatsapp_number: body.whatsappNumber,
      hero_image: body.heroImage,
      logo: body.logo,
      address: body.address,
      operational_hours: body.operationalHours,
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    result = data
  } else {
    const { data, error } = await supabase
      .from('settings')
      .update({
        site_title: body.siteTitle,
        description: body.description,
        whatsapp_number: body.whatsappNumber,
        hero_image: body.heroImage,
        logo: body.logo,
        address: body.address,
        operational_hours: body.operationalHours,
      })
      .eq('id', existing.id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    result = data
  }

  return NextResponse.json({
    siteTitle: result.site_title,
    description: result.description,
    whatsappNumber: result.whatsapp_number,
    heroImage: result.hero_image,
    logo: result.logo,
    address: result.address,
    operationalHours: result.operational_hours,
  })
}
