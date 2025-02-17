'use client';

import Select from 'react-select';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const MenuList = (props: any) => (
  <div className="grid grid-cols-4 gap-2">{props.children}</div>
);

export default function Message() {
  const { t } = useTranslation('common');

  const [formData, setFormData] = useState({
    avatar: '',
    name: '',
    message: '',
  });

  const avatarOptions = Array.from({ length: 16 }, (_, i) => ({
    value: `/assets/${String(i + 1).padStart(2, '0')}.svg`,
    label: t('message.avatar', { number: i + 1 }),
  }));

  const handleAvatarChange = (selectedOption: any) => {
    setFormData(prev => ({ ...prev, avatar: selectedOption.value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error submitting data');

      alert(t('message.submitSuccess'));
      setFormData({ avatar: '', name: '', message: '' });
      setRefresh(refresh + 1);
    } catch (error) {
      console.error('Submission Error:', error);
      alert(t('message.submitFail'));
    }
  };

  const [messages, setMessages] = useState<
    { date: string; avatar: string; name: string; message: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/loading');
        if (!response.ok) throw new Error('Failed to fetch messages');

        const data = await response.json();

        const formattedMessages = (data.messages || []).map(
          (message: {
            date: string;
            avatar: string;
            name: string;
            message: string;
          }) => ({
            date: message.date || t('message.unknownDate'),
            avatar: message.avatar || '/default.svg',
            name: message.name || t('message.anonymous'),
            message: message.message || t('message.noContent'),
          })
        );

        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
        alert(t('message.loadFail'));
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [refresh]);

  return (
    <div className="relative">
      <Image
        src="/assets/bao12.jpeg"
        alt={t('message.backgroundAlt')}
        fill
        quality={10}
        className="inset-0 -z-10 opacity-20 absolute object-cover"
      />
      <div className="mx-auto p-4 md:p-8 min-h-screen bg-cover bg-center">
        <div className="flex flex-col md:flex-row gap-16 justify-center">
          {/* Form Section */}
          <div className="w-full md:w-1/3 bg-white rounded-md shadow-md p-6">
            <h2 className="text-2xl text-center font-medium mb-6">
              {t('message.leaveMessage')}
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <label
                htmlFor="avatar"
                className="block text-gray-700 font-medium text-lg"
              >
                {t('message.avatarLabel')}
              </label>
              <Select
                name="avatar"
                id="avatar"
                value={avatarOptions.find(
                  option => option.value === formData.avatar
                )}
                onChange={handleAvatarChange}
                options={avatarOptions}
                placeholder={t('message.avatarPlaceholder')}
                formatOptionLabel={option => (
                  <div>
                    <Image
                      src={option.value}
                      alt={option.label}
                      className="w-10 h-10"
                    />
                  </div>
                )}
                components={{ MenuList }}
              />
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium text-lg"
                >
                  {t('message.nameLabel')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder={t('message.namePlaceholder')}
                  onChange={handleChange}
                  value={formData.name}
                  className="mt-1 block w-full h-8 border-b-2 border-gray-300 focus:border-blue-500 focus:ring"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-medium text-lg"
                >
                  {t('message.messageLabel')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  onChange={handleChange}
                  value={formData.message}
                  placeholder={t('message.messagePlaceholder')}
                  className="mt-1 block w-full h-24 resize-none border-b-2 border-gray-300 focus:border-blue-500 focus:ring"
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {t('message.submit')}
                </button>
              </div>
            </form>
          </div>

          {/* Messages Section */}
          <div className="w-full md:w-1/3 bg-white rounded-md shadow-md p-6">
            <h2 className="text-2xl text-center font-medium mb-6">
              {t('message.boardTitle')}
            </h2>
            <div className="space-y-6 overflow-y-auto max-h-[600px]">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <span className="animate-spin rounded-full h-16 w-16 border-t-2 border-gray-900"></span>
                  <span className="sr-only">{t('message.loading')}</span>
                </div>
              ) : messages.length > 0 ? (
                messages
                  .slice()
                  .reverse()
                  .map(({ date, avatar, name, message }, index) => (
                    <div
                      key={`${date}-${index}`}
                      className="bg-gray-100 p-4 rounded-md shadow-md border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Image
                            src={
                              avatar.startsWith('/assets/')
                                ? avatar
                                : `/assets${avatar}`
                            }
                            alt={name}
                            width={40}
                            height={40}
                            className="rounded-full mr-3"
                          />
                          <h3 className="font-semibold text-lg">{name}</h3>
                        </div>
                        <p className="text-gray-500 text-sm">{date}</p>
                      </div>
                      <p className="text-gray-700 whitespace-pre-line">
                        {message}
                      </p>
                    </div>
                  ))
              ) : (
                <div className="text-center text-gray-500">
                  {t('message.noMessages')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
