import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/documents - List documents with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const subject = searchParams.get('subject')
    const grade = searchParams.get('grade')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: Record<string, unknown> = {
      isApproved: true,
    }

    if (category && category !== 'tat-ca') {
      where.category = category
    }

    if (subject && subject !== 'tat-ca') {
      where.subject = subject
    }

    if (grade && grade !== '0') {
      where.grade = parseInt(grade)
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { authorName: { contains: search } },
      ]
    }

    const [documents, total] = await Promise.all([
      db.document.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.document.count({ where }),
    ])

    const totalLikes = await db.document.aggregate({
      where: { isApproved: true },
      _sum: { likes: true },
    })

    const totalDownloads = await db.document.aggregate({
      where: { isApproved: true },
      _sum: { downloads: true },
    })

    return NextResponse.json({
      documents,
      total,
      totalLikes: totalLikes._sum.likes || 0,
      totalDownloads: totalDownloads._sum.downloads || 0,
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Không thể tải tài liệu' }, { status: 500 })
  }
}

// POST /api/documents - Create new document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category, subject, grade, authorName, fileUrl, fileType, tags } = body

    if (!title || !description || !category || !authorName) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      )
    }

    const document = await db.document.create({
      data: {
        title,
        description,
        category,
        subject: subject || 'all',
        grade: grade ? parseInt(grade) : 0,
        authorName,
        fileUrl: fileUrl || null,
        fileType: fileType || null,
        tags: tags ? JSON.stringify(tags) : null,
      },
    })

    return NextResponse.json({ document }, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json({ error: 'Không thể tạo tài liệu' }, { status: 500 })
  }
}

// PATCH /api/documents - Update likes/downloads
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action } = body

    if (!id || !action) {
      return NextResponse.json(
        { error: 'Thiếu thông tin' },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {}

    if (action === 'like') {
      updateData.likes = { increment: 1 }
    } else if (action === 'download') {
      updateData.downloads = { increment: 1 }
    } else {
      return NextResponse.json(
        { error: 'Hành động không hợp lệ' },
        { status: 400 }
      )
    }

    const document = await db.document.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ document })
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json({ error: 'Không thể cập nhật tài liệu' }, { status: 500 })
  }
}
