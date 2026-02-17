import { useState } from 'react';
import type { News, CreateNewsDto } from '@/types/news';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, Search, Loader2, Newspaper, ImageIcon } from 'lucide-react';
import { formatDateTime, truncate } from '@/lib/utils';
import Pagination from '@/features/pagination';
import { useNews, useCreateNews, useUpdateNews, useDeleteNews } from '@/hooks/use-news';
import { NewsFormDialog } from '@/features/news/news-form.dialog';
import { DeleteNewsDialog } from '@/features/news/delete-news.dialog';

export default function NewsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<News | null>(null);

    const { data, isLoading } = useNews({
        page,
        limit: 10,
        search: searchTerm,
        sortOrder: 'DESC',
    });

    const createMutation = useCreateNews();
    const updateMutation = useUpdateNews();
    const deleteMutation = useDeleteNews();

    const handleCreate = () => {
        setSelectedNews(null);
        setFormOpen(true);
    };

    const handleEdit = (news: News) => {
        setSelectedNews(news);
        setFormOpen(true);
    };

    const handleDelete = (news: News) => {
        setSelectedNews(news);
        setDeleteOpen(true);
    };

    const handleFormSubmit = (data: CreateNewsDto) => {
        if (selectedNews?.id) {
            updateMutation.mutate(
                { id: selectedNews.id, dto: data },
                {
                    onSuccess: () => {
                        setFormOpen(false);
                        setSelectedNews(null);
                    },
                }
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => {
                    setFormOpen(false);
                    setSelectedNews(null);
                },
            });
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedNews?.id) {
            deleteMutation.mutate(selectedNews.id, {
                onSuccess: () => {
                    setDeleteOpen(false);
                    setSelectedNews(null);
                },
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">News</h1>
                    <p className="text-muted-foreground">
                        Manage news articles and updates
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Article
                </Button>
            </div>

            <Card className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search news..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : !data?.data.length ? (
                    <div className="text-center py-12">
                        <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            {searchTerm
                                ? 'No articles found matching your search.'
                                : 'No news articles yet. Create your first one!'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Image</TableHead>
                                        <TableHead>Title (EN)</TableHead>
                                        <TableHead className="hidden md:table-cell">Title (RU)</TableHead>
                                        <TableHead className="hidden lg:table-cell">Title (UZ)</TableHead>
                                        <TableHead className="hidden md:table-cell">Author</TableHead>
                                        <TableHead className="hidden xl:table-cell">Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.data.map((news: News) => (
                                        <TableRow key={news.id}>
                                            {/* Image */}
                                            <TableCell>
                                                {news.imageUrl ? (
                                                    <img
                                                        src={news.imageUrl}
                                                        alt={news.titleEn}
                                                        className="w-14 h-14 object-cover rounded-md"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 bg-muted rounded-md flex items-center justify-center">
                                                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </TableCell>

                                            {/* Title EN */}
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-sm font-medium text-primary">
                                                            {news.titleEn.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium truncate max-w-[160px]">
                                                            {news.titleEn}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                                                            {truncate(news.contentEn, 40)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Title RU */}
                                            <TableCell className="hidden md:table-cell">
                                                <div className="min-w-0">
                                                    <p className="font-medium truncate max-w-[160px]">
                                                        {news.titleRu}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                                                        {truncate(news.contentRu, 40)}
                                                    </p>
                                                </div>
                                            </TableCell>

                                            {/* Title UZ */}
                                            <TableCell className="hidden lg:table-cell">
                                                <div className="min-w-0">
                                                    <p className="font-medium truncate max-w-[160px]">
                                                        {news.titleUz}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                                                        {truncate(news.contentUz, 40)}
                                                    </p>
                                                </div>
                                            </TableCell>

                                            {/* Author */}
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                                        <span className="text-xs font-medium">
                                                            {news.author.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">
                                                        {news.author}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* Created */}
                                            <TableCell className="text-muted-foreground text-sm hidden xl:table-cell">
                                                {formatDateTime(news.createdAt)}
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(news)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(news)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <Pagination
                            meta={data?.meta}
                            length={data?.data?.length}
                            onPageChange={setPage}
                            currentPage={page}
                        />
                    </>
                )}
            </Card>

            <NewsFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                onSubmit={handleFormSubmit}
                news={selectedNews}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />

            <DeleteNewsDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDeleteConfirm}
                news={selectedNews}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}