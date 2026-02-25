// src/pages/projects.tsx
import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, Loader2, FolderKanban, X } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import Pagination from '@/features/pagination';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@/hooks/use-projects';
import { usePortfolios } from '@/hooks/use-portfolios';
import type { Project, CreateProjectDto } from '@/types/project';
import { useDebounce } from '@/hooks/use-debounce';

export default function ProjectsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const debouncedSearch = useDebounce(searchTerm, 500);
    const effectiveSearch = debouncedSearch.length >= 3 ? debouncedSearch : '';

    const { data, isLoading } = useProjects({
        page,
        limit: 10,
        search: effectiveSearch,
    });

    // Get portfolio counts for each project
    const { data: portfoliosData } = usePortfolios({ page: 1, limit: 1000 });

    const getPortfolioCount = (projectId: string) => {
        return portfoliosData?.data.filter(p => p.projectId === projectId).length || 0;
    };

    const createMutation = useCreateProject();
    const updateMutation = useUpdateProject();
    const deleteMutation = useDeleteProject();

    const handleCreate = () => {
        setSelectedProject(null);
        setFormOpen(true);
    };

    const handleEdit = (project: Project) => {
        setSelectedProject(project);
        setFormOpen(true);
    };

    const handleDelete = (project: Project) => {
        setSelectedProject(project);
        setDeleteOpen(true);
    };

    const handleFormSubmit = (data: CreateProjectDto) => {
        if (selectedProject?.id) {
            updateMutation.mutate(
                { id: selectedProject.id, data },
                {
                    onSuccess: () => {
                        setFormOpen(false);
                        setSelectedProject(null);
                    },
                }
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => {
                    setFormOpen(false);
                    setSelectedProject(null);
                },
            });
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedProject?.id) {
            deleteMutation.mutate(selectedProject.id, {
                onSuccess: () => {
                    setDeleteOpen(false);
                    setSelectedProject(null);
                },
            });
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setPage(1);
    };

    const getSearchPlaceholder = () => {
        if (searchTerm.length > 0 && searchTerm.length < 3) {
            return `Type ${3 - searchTerm.length} more...`;
        }
        return 'Search projects (min 3 chars)...';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">
                        Manage your portfolio projects in multiple languages
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                </Button>
            </div>

            <Card className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={getSearchPlaceholder()}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10 pr-10"
                        />
                        {searchTerm && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : !data?.data.length ? (
                    <div className="text-center py-12">
                        <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            {searchTerm
                                ? 'No projects found matching your search.'
                                : 'No projects yet. Create your first one!'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>English</TableHead>
                                        <TableHead className="hidden md:table-cell">Russian</TableHead>
                                        <TableHead className="hidden lg:table-cell">Uzbek</TableHead>
                                        <TableHead>Portfolios</TableHead>
                                        <TableHead className="hidden xl:table-cell">Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.data.map((project: Project) => (
                                        <TableRow key={project.id}>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-sm font-medium text-primary">
                                                            {project.nameEn.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className="text-muted-foreground font-medium">
                                                        {project.nameEn}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground font-medium hidden md:table-cell">
                                                {project.nameRu}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground font-medium hidden lg:table-cell">
                                                {project.nameUz}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {getPortfolioCount(project.id)} {getPortfolioCount(project.id) === 1 ? 'Portfolio' : 'Portfolios'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm hidden xl:table-cell">
                                                {formatDateTime(project.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(project)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(project)}
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
                        />
                    </>
                )}
            </Card>

            {/* <ProjectFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                onSubmit={handleFormSubmit}
                project={selectedProject}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />

            <DeleteProjectDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDeleteConfirm}
                project={selectedProject}
                isLoading={deleteMutation.isPending}
            /> */}
        </div>
    );
}