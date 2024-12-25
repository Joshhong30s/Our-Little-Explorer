'use client';

import Select from 'react-select';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const MenuList = (props: any) => (
  <div className="grid grid-cols-4 gap-2">{props.children}</div>
);

export default function Message() {
  const [formData, setFormData] = useState({
    avatar: '',
    name: '',
    message: '',
  });

  const avatarOptions = Array.from({ length: 16 }, (_, i) => ({
    value: `/assets/${String(i + 1).padStart(2, '0')}.svg`,
    label: `Avatar ${i + 1}`,
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

      alert('留言成功!');
      setFormData({ avatar: '', name: '', message: '' });
      setRefresh(refresh + 1);
    } catch (error) {
      console.error('Submission Error:', error);
      alert('提交失敗，請稍後重試。');
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
        console.log('Fetched data:', data);

        // 確保 messages 是 array，且符合預期結構
        const formattedMessages = (data.messages || []).map(
          (message: {
            date: string;
            avatar: string;
            name: string;
            message: string;
          }) => ({
            date: message.date || '未知日期',
            avatar: message.avatar || '/default.svg',
            name: message.name || '匿名',
            message: message.message || '無留言內容',
          })
        );

        console.log('Formatted messages for display:', formattedMessages);
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
        alert('無法載入留言，請稍後再試。');
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
        alt="message background"
        fill
        quality={10}
        className="inset-0 -z-10 opacity-20 absolute object-cover"
      />
      <div className="mx-auto p-4 md:p-8 min-h-screen bg-cover bg-center">
        <div className="flex flex-col md:flex-row gap-16 justify-center">
          {/* Form Section */}
          <div className="w-full md:w-1/3 bg-white rounded-md shadow-md p-6">
            <h2 className="text-2xl text-center font-medium mb-6">
              我要留言給小寶
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <label
                htmlFor="avatar"
                className="block text-gray-700 font-medium text-lg"
              >
                我的頭像
              </label>
              <Select
                name="avatar"
                id="avatar"
                value={avatarOptions.find(
                  option => option.value === formData.avatar
                )}
                onChange={handleAvatarChange}
                options={avatarOptions}
                placeholder="請選擇一個頭像"
                formatOptionLabel={option => (
                  <div>
                    <img
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
                  我的稱呼
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="我是誰.."
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
                  我的留言
                </label>
                <textarea
                  id="message"
                  name="message"
                  onChange={handleChange}
                  value={formData.message}
                  placeholder="請寫下你的留言..."
                  className="mt-1 block w-full h-24 resize-none border-b-2 border-gray-300 focus:border-blue-500 focus:ring"
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  送出
                </button>
              </div>
            </form>
          </div>

          {/* Messages Section */}
          <div className="w-full md:w-1/3 bg-white rounded-md shadow-md p-6">
            <h2 className="text-2xl text-center font-medium mb-6">
              小寶留言板
            </h2>
            <div className="space-y-6 overflow-y-auto max-h-[600px]">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <span className="animate-spin rounded-full h-16 w-16 border-t-2 border-gray-900"></span>
                  <span className="sr-only">讀取留言中 ...</span>
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
                <div className="text-center text-gray-500">目前沒有留言</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
