import { useState } from 'react';
import { Flex, Form, Input, Modal, Radio, Select, Space } from 'antd';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import TextArea from 'antd/es/input/TextArea';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IDataType } from './PartnersTable';

interface ModalProps {
    setOpen: (open: boolean) => void,
    setPartners: React.Dispatch<React.SetStateAction<IDataType[]>>,
    open: boolean
}

// Схема валидации zod
const formSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, 'Минимум 2 символа').nonempty('Обязательное поле'),
    inn: z.string().min(10, 'ИНН должен содержать не менее 10 цифр').max(12, 'Слишком длинный ИНН'),
    kpp: z.string().min(9, 'КПП должен содержать 9 цифр').max(9, 'Слишком длинный КПП').or(z.literal('')),
    group: z.string().nonempty("Выберите группу"),
    description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>;

const groupData = [
    { value: "Группа 1", label: "Группа 1" },
    { value: "Группа 2", label: "Группа 2" },
    { value: "Группа 3", label: "Группа 3" },
    { value: "Группа 4", label: "Группа 4" },
    { value: "Группа 5", label: "Группа 5" },
];

function ModalComponent({ setOpen, open, setPartners }: ModalProps) {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [position, setPosition] = useState<"start" | "end">("start");

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: '',
            name: "",
            inn: "",
            kpp: "",
            group: "",
            description: "",
        },
    });

    const handleOk: SubmitHandler<FormValues> = (data: FormValues) => {
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
            setPartners(prev => [...prev, {
                ...data,
                id: new Date().toISOString(),
                description: data.description ?? null

            }]);
            reset()
        }, 500);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <Modal
                title="Новый контрагент"
                open={open}
                onOk={handleSubmit(handleOk)}
                okText='Сохранить'
                cancelText='Отменить'
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Space>
                    <Radio.Group
                        style={{ margin: "0 0 5px" }}
                        size="small"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                    >
                        <Radio.Button value="start">Физ.лицо</Radio.Button>
                        <Radio.Button value="end">Юр.лицо</Radio.Button>
                    </Radio.Group>
                </Space>
                <Form layout="vertical" style={{ maxWidth: 600 }}>
                    <Flex gap={16} style={{ width: "100%" }}>
                        <Form.Item
                            label="Название"
                            style={{ flex: 1 }}
                            help={errors.name?.message}
                            validateStatus={errors.name ? "error" : ""}
                        >
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Введите название" />}
                            />
                        </Form.Item>
                        <Form.Item
                            label="ИНН"
                            style={{ flex: 1 }}
                            help={errors.inn?.message}
                            validateStatus={errors.inn ? "error" : ""}
                        >
                            <Controller
                                name="inn"
                                control={control}
                                render={({ field }) => <Input {...field} type="number" placeholder="Введите ИНН" />}
                            />
                        </Form.Item>
                        <Form.Item
                            hidden={position === 'start'}
                            label="КПП"
                            style={{ flex: 1 }}
                            help={errors.kpp?.message}
                            validateStatus={errors.kpp ? "error" : ""}
                        >
                            <Controller
                                name="kpp"
                                control={control}
                                render={({ field }) => <Input {...field} type="number" placeholder="Введите КПП" />}
                            />
                        </Form.Item>
                    </Flex>
                    <Form.Item label="Группа" help={errors.group?.message} validateStatus={errors.group ? "error" : ""}>
                        <Controller
                            name="group"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Выберите группу"
                                    options={groupData}
                                    onChange={(value) => field.onChange(value)}
                                    value={field.value || ""}
                                />
                            )}
                        />
                    </Form.Item>
                    <Form.Item label="Комментарий">
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => <TextArea {...field} placeholder="Комментарий" rows={4} />}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ModalComponent;