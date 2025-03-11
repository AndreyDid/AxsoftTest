import { useEffect, useState } from 'react';
import { Flex, Form, Input, Modal, Radio, Select, Space } from 'antd';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import TextArea from 'antd/es/input/TextArea';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IPartner } from '../interfaces/IPartner';

interface ModalProps {
    setOpen: (open: boolean) => void,
    setPartners: React.Dispatch<React.SetStateAction<IPartner[]>>,
    createPartner: (partner: Omit<IPartner, 'id'>) => void,
    updatePartner: (partner: IPartner) => void,
    isCreateLoading: boolean,
    open: boolean,
    selectedPartner: IPartner | null,
    setSelectedPartner: (selectedTartner: IPartner | null) => void
}

const groupData = [
    { value: "Группа 1", label: "Группа 1" },
    { value: "Группа 2", label: "Группа 2" },
    { value: "Группа 3", label: "Группа 3" },
    { value: "Группа 4", label: "Группа 4" },
    { value: "Группа 5", label: "Группа 5" },
];

function ModalComponent({ setOpen, open, createPartner, isCreateLoading, selectedPartner, updatePartner, setSelectedPartner }: ModalProps) {
    const [position, setPosition] = useState<'start' | 'end'>('start');

    const legalEntitySchema = z.discriminatedUnion('hasLegalEntity', [
        z.object({
            hasLegalEntity: z.literal(true),
            inn: z.string().min(10, 'ИНН должен содержать 10 цифр').max(10, 'Слишком длинный ИНН'),
            kpp: z.string().min(9, 'КПП должен содержать 9 цифр').max(9, 'Слишком длинный КПП')
        }),
        z.object({
            hasLegalEntity: z.literal(false),
            inn: z.string().min(12, 'ИНН должен содержать 12 цифр').max(12, 'Слишком длинный ИНН'),
            kpp: z.string().or(z.literal(''))
        }),
    ])

    const formSchema = z.object({
        id: z.string().optional(),
        name: z.string().nonempty('Обязательное поле'),
        group: z.string().nonempty("Выберите группу"),
        description: z.string().nullable(),
    }).and(legalEntitySchema)

    type FormValues = z.infer<typeof formSchema>;

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            group: '',
            inn: '',
            kpp: '',
            description: null,
            hasLegalEntity: false
        },
    });

    useEffect(() => {
        if (selectedPartner) {
            reset(selectedPartner);
        } else {
            reset({
                name: '',
                inn: '',
                kpp: '',
                group: '',
                description: null
            });
        }
    }, [selectedPartner, reset]);

    const hasLegalEntity = useWatch({ control, name: 'hasLegalEntity' })

    const handleOk: SubmitHandler<FormValues> = async (data: FormValues) => {
        if (selectedPartner) {
            await updatePartner({ ...selectedPartner, ...data })
            setSelectedPartner(null)
        } else {
            await createPartner(data)
        }
        reset();
        setOpen(false);
    };

    const handleCancel = () => {
        setSelectedPartner(null)
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
                confirmLoading={isCreateLoading}
                onCancel={handleCancel}
            >
                <Space>
                    <Controller
                        name='hasLegalEntity'
                        control={control}
                        render={({ field }) => (
                            <Radio.Group
                                {...field}
                                style={{ margin: "0 0 5px" }}
                                size="small"
                                value={position}
                                onChange={(e) => field.onChange(
                                    e.target.value === 'end',
                                    setPosition(e.target.value)
                                )}
                            >
                                <Radio.Button {...field} value="start">Физ.лицо</Radio.Button>
                                <Radio.Button {...field} value="end">Юр.лицо</Radio.Button>
                            </Radio.Group>
                        )}
                    />
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
                        {hasLegalEntity && (
                            <Form.Item
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
                        )}
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
                            render={({ field }) => <TextArea {...field} value={field.value ?? undefined} placeholder="Комментарий" rows={4} />}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ModalComponent;