import { useTranslation } from 'react-i18next'

const Component: React.FC = () => {
  const { i18n } = useTranslation()

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng)
    document.documentElement.lang = lng
  }

  return (
    <select
      value={i18n.language}
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="de">Deutsch</option>
      <option value="no">Norsk</option>
    </select>
  )
}

export default Component