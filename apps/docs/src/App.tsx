import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import DocsLayout from './layouts/DocsLayout';
import HomePage from './pages/HomePage';

const ButtonPage = lazy(() => import('./pages/components/ButtonPage'));
const FloatButtonPage = lazy(() => import('./pages/components/FloatButtonPage'));
const TypographyPage = lazy(() => import('./pages/components/TypographyPage'));
const IconPage = lazy(() => import('./pages/components/IconPage'));
const DividerPage = lazy(() => import('./pages/components/DividerPage'));
const SpacePage = lazy(() => import('./pages/components/SpacePage'));
const FlexPage = lazy(() => import('./pages/components/FlexPage'));
const GridPage = lazy(() => import('./pages/components/GridPage'));
const LayoutPage = lazy(() => import('./pages/components/LayoutPage'));
const SplitterPage = lazy(() => import('./pages/components/SplitterPage'));
const MasonryPage = lazy(() => import('./pages/components/MasonryPage'));
const TabsPage = lazy(() => import('./pages/components/TabsPage'));
const MenuPage = lazy(() => import('./pages/components/MenuPage'));
const BreadcrumbPage = lazy(() => import('./pages/components/BreadcrumbPage'));
const DropdownPage = lazy(() => import('./pages/components/DropdownPage'));
const PaginationPage = lazy(() => import('./pages/components/PaginationPage'));
const AnchorPage = lazy(() => import('./pages/components/AnchorPage'));
const InputPage = lazy(() => import('./pages/components/InputPage'));
const InputNumberPage = lazy(() => import('./pages/components/InputNumberPage'));
const SelectPage = lazy(() => import('./pages/components/SelectPage'));
const AutoCompletePage = lazy(() => import('./pages/components/AutoCompletePage'));
const CheckboxPage = lazy(() => import('./pages/components/CheckboxPage'));
const RadioPage = lazy(() => import('./pages/components/RadioPage'));
const SwitchPage = lazy(() => import('./pages/components/SwitchPage'));
const SliderPage = lazy(() => import('./pages/components/SliderPage'));
const ColorPickerPage = lazy(() => import('./pages/components/ColorPickerPage'));
const DatePickerPage = lazy(() => import('./pages/components/DatePickerPage'));
const TimePickerPage = lazy(() => import('./pages/components/TimePickerPage'));
const FormPage = lazy(() => import('./pages/components/FormPage'));
const MentionsPage = lazy(() => import('./pages/components/MentionsPage'));
const RatePage = lazy(() => import('./pages/components/RatePage'));
const UploadPage = lazy(() => import('./pages/components/UploadPage'));
const CascaderPage = lazy(() => import('./pages/components/CascaderPage'));
const TransferPage = lazy(() => import('./pages/components/TransferPage'));
const TreeSelectPage = lazy(() => import('./pages/components/TreeSelectPage'));
const AvatarPage = lazy(() => import('./pages/components/AvatarPage'));
const CardPage = lazy(() => import('./pages/components/CardPage'));
const TagPage = lazy(() => import('./pages/components/TagPage'));
const BadgePage = lazy(() => import('./pages/components/BadgePage'));
const TooltipPage = lazy(() => import('./pages/components/TooltipPage'));
const PopoverPage = lazy(() => import('./pages/components/PopoverPage'));
const CollapsePage = lazy(() => import('./pages/components/CollapsePage'));
const TablePage = lazy(() => import('./pages/components/TablePage'));
const DescriptionsPage = lazy(() => import('./pages/components/DescriptionsPage'));
const EmptyPage = lazy(() => import('./pages/components/EmptyPage'));
const ImagePage = lazy(() => import('./pages/components/ImagePage'));
const StatisticPage = lazy(() => import('./pages/components/StatisticPage'));
const SegmentedPage = lazy(() => import('./pages/components/SegmentedPage'));
const TimelinePage = lazy(() => import('./pages/components/TimelinePage'));
const CarouselPage = lazy(() => import('./pages/components/CarouselPage'));
const QRCodePage = lazy(() => import('./pages/components/QRCodePage'));
const TreePage = lazy(() => import('./pages/components/TreePage'));
const CalendarPage = lazy(() => import('./pages/components/CalendarPage'));
const AlertPage = lazy(() => import('./pages/components/AlertPage'));
const DrawerPage = lazy(() => import('./pages/components/DrawerPage'));
const ModalPage = lazy(() => import('./pages/components/ModalPage'));
const SpinPage = lazy(() => import('./pages/components/SpinPage'));
const SkeletonPage = lazy(() => import('./pages/components/SkeletonPage'));
const ProgressPage = lazy(() => import('./pages/components/ProgressPage'));
const WatermarkPage = lazy(() => import('./pages/components/WatermarkPage'));
const NotificationPage = lazy(() => import('./pages/components/NotificationPage'));
const MessagePage = lazy(() => import('./pages/components/MessagePage'));
const StepsPage = lazy(() => import('./pages/components/StepsPage'));
const ResultPage = lazy(() => import('./pages/components/ResultPage'));
const PopconfirmPage = lazy(() => import('./pages/components/PopconfirmPage'));
const TourPage = lazy(() => import('./pages/components/TourPage'));
const TocPage = lazy(() => import('./pages/components/TocPage'));
const MarkdownEditorPage = lazy(() => import('./pages/components/MarkdownEditorPage'));

function Loading() {
  return (
    <div style={{ padding: 'var(--orot-space-8)', color: 'var(--orot-color-text-muted)' }}>
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DocsLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="components/*"
          element={
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="button" element={<ButtonPage />} />
                <Route path="float-button" element={<FloatButtonPage />} />
                <Route path="typography" element={<TypographyPage />} />
                <Route path="icon" element={<IconPage />} />
                <Route path="divider" element={<DividerPage />} />
                <Route path="space" element={<SpacePage />} />
                <Route path="flex" element={<FlexPage />} />
                <Route path="grid" element={<GridPage />} />
                <Route path="layout" element={<LayoutPage />} />
                <Route path="splitter" element={<SplitterPage />} />
                <Route path="masonry" element={<MasonryPage />} />
                <Route path="tabs" element={<TabsPage />} />
                <Route path="menu" element={<MenuPage />} />
                <Route path="breadcrumb" element={<BreadcrumbPage />} />
                <Route path="dropdown" element={<DropdownPage />} />
                <Route path="pagination" element={<PaginationPage />} />
                <Route path="anchor" element={<AnchorPage />} />
                <Route path="input" element={<InputPage />} />
                <Route path="input-number" element={<InputNumberPage />} />
                <Route path="select" element={<SelectPage />} />
                <Route path="auto-complete" element={<AutoCompletePage />} />
                <Route path="checkbox" element={<CheckboxPage />} />
                <Route path="radio" element={<RadioPage />} />
                <Route path="switch" element={<SwitchPage />} />
                <Route path="slider" element={<SliderPage />} />
                <Route path="color-picker" element={<ColorPickerPage />} />
                <Route path="date-picker" element={<DatePickerPage />} />
                <Route path="time-picker" element={<TimePickerPage />} />
                <Route path="form" element={<FormPage />} />
                <Route path="mentions" element={<MentionsPage />} />
                <Route path="rate" element={<RatePage />} />
                <Route path="upload" element={<UploadPage />} />
                <Route path="cascader" element={<CascaderPage />} />
                <Route path="transfer" element={<TransferPage />} />
                <Route path="tree-select" element={<TreeSelectPage />} />
                <Route path="avatar" element={<AvatarPage />} />
                <Route path="card" element={<CardPage />} />
                <Route path="tag" element={<TagPage />} />
                <Route path="badge" element={<BadgePage />} />
                <Route path="tooltip" element={<TooltipPage />} />
                <Route path="popover" element={<PopoverPage />} />
                <Route path="collapse" element={<CollapsePage />} />
                <Route path="table" element={<TablePage />} />
                <Route path="descriptions" element={<DescriptionsPage />} />
                <Route path="empty" element={<EmptyPage />} />
                <Route path="image" element={<ImagePage />} />
                <Route path="statistic" element={<StatisticPage />} />
                <Route path="segmented" element={<SegmentedPage />} />
                <Route path="timeline" element={<TimelinePage />} />
                <Route path="carousel" element={<CarouselPage />} />
                <Route path="qrcode" element={<QRCodePage />} />
                <Route path="tree" element={<TreePage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="alert" element={<AlertPage />} />
                <Route path="drawer" element={<DrawerPage />} />
                <Route path="modal" element={<ModalPage />} />
                <Route path="spin" element={<SpinPage />} />
                <Route path="skeleton" element={<SkeletonPage />} />
                <Route path="progress" element={<ProgressPage />} />
                <Route path="watermark" element={<WatermarkPage />} />
                <Route path="notification" element={<NotificationPage />} />
                <Route path="message" element={<MessagePage />} />
                <Route path="steps" element={<StepsPage />} />
                <Route path="result" element={<ResultPage />} />
                <Route path="popconfirm" element={<PopconfirmPage />} />
                <Route path="tour" element={<TourPage />} />
                <Route path="toc" element={<TocPage />} />
                <Route path="markdown-editor" element={<MarkdownEditorPage />} />
              </Routes>
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
